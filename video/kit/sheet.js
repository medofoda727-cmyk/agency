function drawSheet(){
  paperBG();
  txt('MAHMOUD — CHARACTER SHEET',540,90,{font:'Inter Tight',weight:900,size:44,color:C.ink,dir:'ltr',spacing:4});
  txt('محمود · صاحب معرض أثاث',540,150,{size:40,weight:600,color:C.goldDeep});
  // front, side, sketch construction
  drawMahmoud(230,820,{s:.95,expr:'neutral'}); txt('FRONT',230,870,{font:'Inter Tight',weight:800,size:26,dir:'ltr',color:C.mute});
  drawMahmoud(540,820,{s:.95,side:true,expr:'neutral'}); txt('SIDE',540,870,{font:'Inter Tight',weight:800,size:26,dir:'ltr',color:C.mute});
  drawMahmoud(850,820,{s:.95,sketch:1,expr:'happy'}); txt('SKETCH LAYER',850,870,{font:'Inter Tight',weight:800,size:26,dir:'ltr',color:C.mute});
  // expressions row (heads)
  const ex=[['excited','حماس'],['worried','قلق'],['think','تفكير'],['frustrated','إحباط'],['shock','صدمة'],['aha','اكتشاف الحل'],['sad','حزن'],['proud','فخر']];
  ex.forEach(([e,l],i)=>{const x=140+(i%4)*267,y=1060+Math.floor(i/4)*260;ctx.save();ctx.translate(x,y);ctx.scale(1.25,1.25);drawHead(Object.assign({},M_DEF,{expr:e,sweat:e==='frustrated'?1:0,sparkle:e==='aha'?1:0}));ctx.restore();txt(l,x,y+125,{size:30,weight:600,color:C.graphite});});
  // poses
  const poses=[{armL:[2.6,.3],armR:[2.6,.3],expr:'excited',l:'Yes!'},{armL:[.4,2.2],armR:[.2,.1],expr:'think',l:'Thinking'},{armL:[.2,.1],armR:[1.4,.2],expr:'proud',l:'Presenting'},{armL:[.05,.05],armR:[.05,.05],expr:'sad',lean:.06,tilt:.15,l:'Defeated'},{walk:.25,expr:'neutral',side:true,l:'Walk'}];
  poses.forEach((p,i)=>{const x=120+i*210;drawMahmoud(x,1880,Object.assign({s:.58},p));txt(p.l,x,1900,{font:'Inter Tight',weight:800,size:22,dir:'ltr',color:C.mute});});
}

// series cast — every lead is a LOOK on the same rig
function drawCastSheet() {
  paperBG();
  txt('FODA STORY SERIES — CAST', 540, 90, { font: 'Inter Tight', weight: 900, size: 44, color: C.ink, dir: 'ltr', spacing: 4 });
  txt('نفس الأسلوب · أبطال مختلفين', 540, 150, { size: 40, weight: 600, color: C.goldDeep });
  const names = [['mahmoud', 'محمود'], ['sara', 'سارة'], ['karim', 'كريم'], ['mona', 'منى'], ['hassan', 'حسن']];
  names.forEach(([k, l], i) => {
    const x = 120 + i * 210;
    drawMahmoud(x, 760, { s: .62, cast: CAST[k], expr: ['proud', 'happy', 'think', 'excited', 'neutral'][i] });
    txt(l, x, 820, { size: 36, weight: 800, color: C.ink });
    txt(k.toUpperCase(), x, 865, { size: 20, font: 'Inter Tight', weight: 800, color: C.mute, dir: 'ltr', spacing: 3 });
  });
  names.forEach(([k], i) => {
    const x = 120 + i * 210;
    ctx.save(); ctx.translate(x, 1100); ctx.scale(1.05, 1.05); drawHead(Object.assign({}, M_DEF, { cast: CAST[k], expr: ['worried', 'aha', 'frustrated', 'shock', 'sad'][i], sparkle: i === 1 ? 1 : 0 })); ctx.restore();
    drawMahmoud(x, 1840, { s: .58, cast: CAST[k], side: true, walk: .2 + i * .15 });
  });
}
