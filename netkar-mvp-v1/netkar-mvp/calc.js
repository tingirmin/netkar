// Pure calculations; all monetary values are in the selected currency, no FX conversion.
export const FIELD_NAMES = ['cost','price','shipping','packaging','other','ads','commission','tax','discount','target'];
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
  for(const name of ['commission','tax','discount']) if(Number.isFinite(n[name]) && n[name]>100) errors[name]='range';
  n.taxEnabled=Boolean(input.taxEnabled);
  if (!n.taxEnabled) { n.tax=0; delete errors.tax; }
  n.commissionBase=input.commissionBase === 'afterTax' ? 'afterTax':'gross';
  return {values:n,errors,valid:Object.keys(errors).length===0};
}
export function calculate(raw) {
  const result=validate(raw);
  if(!result.valid) return {...result, result:null};
  const v=result.values;
  const fixed = v.cost+v.shipping+v.packaging+v.other+v.ads;
  const taxRate=v.taxEnabled?v.tax/100:0;
  const commRate=v.commission/100;
  const commissionFactor=commRate*(v.commissionBase==='afterTax' ? (1-taxRate) : 1);
  const contributionFactor=1-taxRate-commissionFactor;
  const effectivePrice=v.price*(1-v.discount/100);
  const taxAmount=effectivePrice*taxRate;
  const commissionBase= v.commissionBase==='afterTax'?effectivePrice-taxAmount:effectivePrice;
  const commissionAmount=commissionBase*commRate;
  const expenses=fixed+taxAmount+commissionAmount;
  const profit=effectivePrice-expenses;
  const margin=effectivePrice>0?100*profit/effectivePrice:null;
  const roi=fixed>0?100*profit/fixed:null;
  const breakEven=contributionFactor>1e-12?fixed/contributionFactor:null;
  const targetPrice=contributionFactor>1e-12?(fixed+v.target)/contributionFactor:null;
  const multiplier=1-v.discount/100;
  return {...result,result:{fixed,taxAmount,commissionAmount,commissionBase,expenses,profit,margin,roi,breakEven,targetPrice,effectivePrice,contributionFactor,requiredListPrice:targetPrice!==null&&multiplier>0?targetPrice/multiplier:null,breakEvenListPrice:breakEven!==null&&multiplier>0?breakEven/multiplier:null}};
}
export function compareCommissions(input, rates=[5,10,15,20]) {return rates.map(rate=>({rate,result:calculate({...input,commission:rate}).result}));}
