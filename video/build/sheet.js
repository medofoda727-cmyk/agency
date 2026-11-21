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
