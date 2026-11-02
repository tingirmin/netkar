// Pure calculations; all monetary values are in the selected currency, no FX conversion.
export const FIELD_NAMES = ['cost','price','shipping','packaging','other','ads','commission','tax','discount','target','purchaseVat','salesVat','targetMargin'];
export function parseNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value !== 'string') return NaN;
  const s = value.trim().replace(/\s/g,'');
  if (!s) return 0;
  // Accept 1234.56, 1234,56, 1.234,56, 1,234.56; do not guess ambiguous separators.
  const dots = (s.match(/\./g)||[]).length, commas=(s.match(/,/g)||[]).length;
  let normalized=s;
  if (dots && commas) normalized = s.lastIndexOf(',')>s.lastIndexOf('.') ? s.replace(/\./g,'').replace(',','.') : s.replace(/,/g,'');
  else if (commas===1 && dots===0) normalized=s.replace(',','.');
  else if (dots>1 && commas===0 && /^\d{1,3}(\.\d{3})+$/.test(s)) normalized=s.replace(/\./g,'');
  else if (commas>1 && dots===0 && /^\d{1,3}(,\d{3})+$/.test(s)) normalized=s.replace(/,/g,'');
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(normalized)) return NaN;
  const num=Number(normalized); return Number.isFinite(num)? num:NaN;
}
export function validate(input) {
  const n={}; const errors={};
  for (const name of FIELD_NAMES) {
    n[name]=parseNumber(input[name] ?? 0);
    if (!Number.isFinite(n[name]) || n[name]<0 || n[name]>1e12) errors[name]='invalid';
  }
  for(const name of ['commission','tax','discount','purchaseVat','salesVat','targetMargin']) if(Number.isFinite(n[name]) && n[name]>100) errors[name]='range';
  n.taxEnabled=Boolean(input.taxEnabled);
  if (!n.taxEnabled) { n.tax=0; delete errors.tax; }
  n.vatEnabled=Boolean(input.vatEnabled);
  n.purchaseVatIncluded=input.purchaseVatIncluded !== false && input.purchaseVatIncluded !== 'false';
  n.salesVatIncluded=input.salesVatIncluded !== false && input.salesVatIncluded !== 'false';
  n.commissionBase=['gross','afterTax','vatNet'].includes(input.commissionBase)?input.commissionBase:'gross';
  return {values:n,errors,valid:Object.keys(errors).length===0};
}
export function calculate(raw) {
  const result=validate(raw);
  if(!result.valid) return {...result, result:null};
  const v=result.values;
  // Two separate, mutually exclusive models: VAT or a simple sales levy.
  // Non-product expenses are treated as entered and have no recoverable VAT assumed.
  const vat=v.vatEnabled;
  const saleFactor=vat?(v.salesVatIncluded?1/(1+v.salesVat/100):1):1;
  const inputCost=vat&&v.purchaseVatIncluded?v.cost/(1+v.purchaseVat/100):v.cost;
  const purchaseVatAmount=vat?(v.purchaseVatIncluded?v.cost-inputCost:v.cost*v.purchaseVat/100):0;
  const fixed=inputCost+v.shipping+v.packaging+v.other+v.ads;
  const levyRate=!vat&&v.taxEnabled?v.tax/100:0;
  const commissionRate=v.commission/100;
  // Gross commission on the customer-facing price. VAT-net basis uses VAT-exclusive revenue.
  const commissionFactor=commissionRate*(v.commissionBase==='vatNet'?saleFactor:(v.commissionBase==='afterTax'&&!vat?1-levyRate:1));
  const contributionFactor=saleFactor-levyRate-commissionFactor;
  const effectivePrice=v.price*(1-v.discount/100);
  const netRevenue=effectivePrice*saleFactor;
  const salesVatAmount=vat?(v.salesVatIncluded?effectivePrice-netRevenue:effectivePrice*v.salesVat/100):0;
  const taxAmount=vat?salesVatAmount-purchaseVatAmount:effectivePrice*levyRate;
  const commissionBase=v.commissionBase==='vatNet'?netRevenue:(v.commissionBase==='afterTax'&&!vat?effectivePrice*(1-levyRate):effectivePrice);
  const commissionAmount=commissionBase*commissionRate;
  const expenses=fixed+commissionAmount+(!vat?taxAmount:0);
  const profit=netRevenue-expenses-(!vat?0:0);
  const margin=netRevenue>0?100*profit/netRevenue:null;
  const roi=fixed>0?100*profit/fixed:null;
  const breakEven=contributionFactor>1e-12?fixed/contributionFactor:null;
  const targetPrice=contributionFactor>1e-12?(fixed+v.target)/contributionFactor:null;
  // Target margin is defined against VAT-exclusive sales revenue, not VAT-inclusive cash collected.
  const marginFactor=contributionFactor-v.targetMargin/100*saleFactor;
  const targetMarginPrice=marginFactor>1e-12?fixed/marginFactor:null;
  const multiplier=1-v.discount/100;
  // In VAT-exclusive sale mode, effectivePrice is VAT-exclusive quoted sale price.
  // salesVatAmount is collected in addition, not deducted from profit again.
  return {...result,result:{fixed,taxAmount,commissionAmount,commissionBase,expenses,profit,margin,roi,breakEven,targetPrice,targetMarginPrice,netRevenue,purchaseVatAmount,salesVatAmount,vatPayable:salesVatAmount-purchaseVatAmount,effectivePrice,contributionFactor,requiredListPrice:targetPrice!==null&&multiplier>0?targetPrice/multiplier:null,breakEvenListPrice:breakEven!==null&&multiplier>0?breakEven/multiplier:null}};
}
export function compareCommissions(input, rates=[5,10,15,20]) {return rates.map(rate=>({rate,result:calculate({...input,commission:rate}).result}));}
