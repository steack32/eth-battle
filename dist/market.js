export function analyse(samples, now=Date.now()) {
 const all=samples.filter(x=>now-x.t<=300000);const recent=all.filter(x=>now-x.t<=60000);
 if(recent.length<2)return {change:0,intensity:0,pressure:50,span:0};
 const change=(recent.at(-1).p/recent[0].p-1)*100;
 const returns=arr=>arr.slice(1).map((x,i)=>Math.abs(Math.log(x.p/arr[i].p))*100);
 const rv=returns(recent),baseline=returns(all);const avg=arr=>arr.reduce((a,b)=>a+b,0)/(arr.length||1);
 const vol=avg(rv),base=avg(baseline),span=(recent.at(-1).t-recent[0].t)/1000;
 const intensity=Math.min(1,Math.max(0, vol/.025*.55+Math.abs(change)/.6*.25+Math.max(0,vol/Math.max(base,.006)-1)*.2));
 return {change,intensity,pressure:50+Math.tanh(change/.18)*38,span};
}
