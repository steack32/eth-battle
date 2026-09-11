// Bounded real-time battle simulation. Coordinates are normalized to the field.
export class War {
 constructor(random=Math.random){this.random=random;this.units=[];this.shots=[];this.wrecks=[];this.effects=[];this.jets=[];this.time=0;this.nextId=0;this.front=.5;this.wave=0;this.air=3;this.spawned=0;this.killed=0;this.impacts=[];for(let side=0;side<2;side++)for(let i=0;i<38;i++)this.spawn(side,i<7?'tank':'soldier',true);}
 rand(a,b){return a+this.random()*(b-a);}
 spawn(side,kind,initial=false){if(this.units.length>=140)return;const lane=this.rand(.36,.9);this.units.push({id:++this.nextId,side,kind,x:initial?(side===0?this.rand(.04,.4):this.rand(.6,.96)):(side===0?-.045:1.045),y:lane,lane,depth:this.rand(.035,.23),hp:kind==='tank'?5:2,cool:this.rand(.1,2),move:0,flash:0,age:0,phase:this.rand(0,6.28)});this.spawned++;}
 blast(x,y,p=1){this.effects.push({x,y,p,age:0,seed:this.rand(0,6.28)});if(this.effects.length>110)this.effects.shift();this.impacts.push(p);}
 damage(u,n){if(u.hp<=0)return;u.hp-=n;if(u.hp>0)return;this.killed++;this.blast(u.x,u.y,u.kind==='tank'?2:.6);this.wrecks.push({...u,age:0});if(this.wrecks.length>65)this.wrecks.shift();}
 step(dt,{intensity=0,pressure=50,live=false,reduced=false}={}){dt=Math.min(.05,Math.max(0,dt));this.time+=dt;this.impacts=[];const force=live?intensity:0,pace=reduced?.4:1;this.front+=((.5+(pressure-50)/100*.6)-this.front)*dt*.5;
 this.wave-=dt;this.air-=dt;const living=this.units.filter(u=>u.hp>0);this.units=living;
 if(this.wave<=0){for(let s=0;s<2;s++){const count=living.filter(u=>u.side===s).length;const desired=48+Math.round(force*16);for(let i=0;i<Math.min(desired-count,3+Math.floor(force*3));i++)this.spawn(s,this.random()<.22?'tank':'soldier');}this.wave=this.rand(.65,1.4)/(1+force);}
 for(const u of this.units){u.age+=dt;u.flash=Math.max(0,u.flash-dt);const dir=u.side===0?1:-1;const targetX=this.front-dir*u.depth+Math.sin(this.time*.7+u.phase)*.045;const dx=targetX-u.x;u.move=Math.abs(dx)>.008?Math.sign(dx):0;const speed=(u.kind==='tank'?.023:.044)*(1+force*.65)*pace;u.x+=Math.sign(dx)*Math.min(Math.abs(dx),speed*dt);u.y+=(u.lane+Math.sin(this.time*.8+u.phase)*.023-u.y)*dt*1.6*pace;u.cool-=dt;
 if(u.cool<=0&&u.x>.015&&u.x<.985){const enemies=this.units.filter(v=>v.side!==u.side&&v.hp>0&&v.x>0&&v.x<1);let best=null,score=Infinity;for(const v of enemies){const d=Math.abs(v.y-u.y)*2+Math.abs(v.x-u.x)+this.random()*.2;if(d<score){best=v;score=d;}}if(best){const tank=u.kind==='tank';u.flash=.13;this.shots.push({x:u.x+dir*(tank?.021:.006),y:u.y,tx:best.x+this.rand(-.008,.008),ty:best.y,target:best,side:u.side,p:tank?1:.25,damage:tank?3:1,age:0,duration:tank?.65:.23,hit:this.random()<(tank?.8:.6)});u.cool=this.rand(tank?1.9:.65,tank?3.4:1.55)/(1+force*1.8)/pace;}else u.cool=.5;}}
 if(this.air<=0&&!reduced){const side=this.random()<pressure/100?0:1;this.jets.push({side,x:side===0?-.2:1.2,y:this.rand(.35,.68),drops:0});this.air=this.rand(9,15)/(1+force*2);}
 for(const j of this.jets){j.x+=dt*(j.side===0?1:-1)*.3;if(Math.abs(j.x-this.front)<.15&&j.drops<3){j.drops++;const x=j.x+(j.side===0?.06:-.06),y=j.y+.1;this.blast(x,y,1.5);for(const u of this.units)if(u.side!==j.side&&Math.hypot(u.x-x,(u.y-y)*.7)<.08)this.damage(u,3);}}
 this.jets=this.jets.filter(j=>j.x>-.3&&j.x<1.3);
 for(const s of this.shots){s.age+=dt;if(s.age>=s.duration){this.blast(s.tx,s.ty,s.p);if(s.hit)this.damage(s.target,s.damage);}}this.shots=this.shots.filter(s=>s.age<s.duration).slice(-200);
 for(const e of this.effects)e.age+=dt;this.effects=this.effects.filter(e=>e.age<(reduced?.5:2.8));for(const w of this.wrecks)w.age+=dt;this.wrecks=this.wrecks.filter(w=>w.age<18);this.units=this.units.filter(u=>u.hp>0);
 }
}
