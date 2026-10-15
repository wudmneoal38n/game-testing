import * as THREE from './vendor/three.module.min.js';
export function createMeadow(host) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true,alpha:false}); } catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor('#c8eeff');
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  renderer.domElement.setAttribute('aria-label','3D meadow with your animal and three answer gates');
  host.prepend(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,1,.1,100);
  camera.position.set(0,5.3,10);camera.lookAt(0,.8,0);
  scene.fog=new THREE.Fog('#c8eeff',18,55);
  scene.add(new THREE.HemisphereLight(0xfff5e5,0x73975f,1.8));
  const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(-5,10,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-9;sun.shadow.camera.right=9;sun.shadow.camera.top=9;sun.shadow.camera.bottom=-9;sun.shadow.normalBias=.035;scene.add(sun);
  const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.7});
  function ball(parent,c,x,y,z,sx,sy= sx,sz=sx){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),mat(c));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),mat('#8cda9b'));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
  const textureCanvas=document.createElement('canvas');textureCanvas.width=256;textureCanvas.height=256;
  const ctx=textureCanvas.getContext('2d');ctx.fillStyle='#83b968';ctx.fillRect(0,0,256,256);
  let seed=37;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  for(let i=0;i<5500;i++){ctx.strokeStyle=['#7aaf5e','#99c87d','#689e53'][i%3];const x=random()*256,y=random()*256;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+random()*3-1,y-2-random()*5);ctx.stroke()}
  const grass=new THREE.CanvasTexture(textureCanvas);grass.colorSpace=THREE.SRGBColorSpace;grass.wrapS=grass.wrapT=THREE.RepeatWrapping;grass.repeat.set(22,22);ground.material.map=grass;ground.material.color.set('#ffffff');
  for(let i=0;i<16;i++){const x=(i%2?-1:1)*(7+random()*12),z=-7-random()*18;const tree=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18,.24,2.3,12),mat('#806148'));trunk.position.y=1;trunk.castShadow=true;tree.add(trunk);ball(tree,'#598e53',0,2.6,0,1.15,1.6,1.05);ball(tree,'#77a85b',.6,2.9,0,.9,1.1,.9);tree.position.set(x,0,z);scene.add(tree)}
  for(let i=0;i<8;i++){ball(scene,'#a0bd88',-25+i*8,-1,-32-random()*10,8,5,5)}
  const rings=[];
  [-2.5,0,2.5].forEach((x,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(.85,.12,12,48),mat(['#ba66e5','#f4ba38','#30bfa8'][i]));ring.position.set(x,1.4,0);scene.add(ring);rings.push(ring);ball(scene,'#e9d7fa',x,.03,0,1,.08,.65)});
  for(let i=0;i<20;i++){const x=(i%2?1:-1)*(4+Math.floor(i/2)*1.2);ball(scene,['#f7a4d4','#ffe278','#b4a2ee'][i%3],x,.18,-2-(i%5),.17);}
  function animal(dog){const g=new THREE.Group(),white=dog?'#fff0d9':'#fff5ff',accent=dog?'#ad7a50':'#e789cb';
    ball(g,white,0,dog?.68:.85,0,dog?.43:.42,dog?.4:.48,dog?.65:.76);
    const legs=[];
    for(const x of [-.26,.26])for(const z of [-.4,.4]){const leg=new THREE.Group();leg.position.set(x,.65,z);ball(leg,white,0,-.22,0,dog?.14:.105,.3,.12);ball(leg,dog?'#e1c6a0':'#75677d',0,-.54,-.04,.15,.1,.19);g.add(leg);legs.push(leg)}
    g.userData.legs=legs;
    if(!dog)ball(g,white,0,1.25,-.4,.26,.55,.3);
    ball(g,white,0,1.18,-.36,.42,.44,.4);
    ball(g,white,0,1.05,-.67,.31,.22,.27);
    for(const x of [-.22,.22]){ball(g,'#302840',x,1.28,-.68,.065);ball(g,accent,x*(dog?1.9:1),dog?1.15:1.59,-.34,dog?.2:.12,dog?.38:.25,.13)}
    if(dog){ball(g,'#392c35',0,1.1,-.9,.1,.08,.07);ball(g,'#ef8fa7',0,.94,-.82,.08,.12,.05);for(let i=0;i<9;i++)ball(g,white,Math.sin(i*2)*.35,.85+Math.cos(i)*.2,Math.cos(i*2)*.4,.18);ball(g,accent,.08,.9,.65,.14,.28,.14)}
    else{const horn=new THREE.Mesh(new THREE.ConeGeometry(.11,.58,16),mat('#ffd65d'));horn.position.set(0,1.85,-.49);g.add(horn);for(let i=0;i<5;i++)ball(g,['#d998e7','#f1a2d3','#b6a0ed'][i%3],0,1.5-i*.16,-.03+i*.08,.2);ball(g,accent,0,.8,.75,.2,.42,.19)}
    if(dog){
      for(let i=0;i<105;i++){const theta=i*2.39996,sy=1-2*(i+.5)/105,r=Math.sqrt(1-sy*sy);ball(g,i%5?'#fff0da':'#e5cfb2',Math.cos(theta)*r*.43,.69+sy*.4,Math.sin(theta)*r*.65,.075,.09,.1)}
      for(let i=0;i<32;i++){const theta=i*2.39996,sy=1-2*(i+.5)/32,r=Math.sqrt(1-sy*sy);ball(g,'#fff1de',Math.cos(theta)*r*.4,1.2+sy*.4,-.32+Math.sin(theta)*r*.33,.075)}
    } else {
      for(let i=0;i<16;i++){const strand=ball(g,['#e7bdd5','#c5b1d5','#e9d2ea'][i%3],Math.sin(i)*.07,1.57-i*.055,.06+i*.025,.065,.14,.075);strand.rotation.z=Math.sin(i)*.3}
      for(let i=0;i<8;i++)ball(g,'#dfbdd9',Math.sin(i)*.08,.83-i*.045,.76+i*.025,.06,.19,.07);
    }
    const glitterSource=new THREE.Object3D();
    glitterSource.position.set(dog?.08:0,dog?1.18:2.14,dog?.65:-.49);
    g.add(glitterSource);g.userData.glitterSource=glitterSource;
    // Legs bend during the leap and step as the animal moves between lanes.
    return g;
  }
  const luna=animal(false),pip=animal(true);scene.add(luna,pip);pip.visible=false;
  let active=luna,lane=1,flight=null,lastTime=0;
  const sparkleCanvas=document.createElement('canvas');sparkleCanvas.width=64;sparkleCanvas.height=64;
  const sparkleContext=sparkleCanvas.getContext('2d');
  const glow=sparkleContext.createRadialGradient(32,32,0,32,32,32);
  glow.addColorStop(0,'#ffffffff');glow.addColorStop(.18,'#ffffffee');glow.addColorStop(1,'#ffffff00');
  sparkleContext.fillStyle=glow;sparkleContext.fillRect(0,0,64,64);
  sparkleContext.fillStyle='white';sparkleContext.beginPath();
  sparkleContext.moveTo(32,3);sparkleContext.lineTo(38,26);sparkleContext.lineTo(61,32);sparkleContext.lineTo(38,38);sparkleContext.lineTo(32,61);sparkleContext.lineTo(26,38);sparkleContext.lineTo(3,32);sparkleContext.lineTo(26,26);sparkleContext.closePath();sparkleContext.fill();
  const sparkleTexture=new THREE.CanvasTexture(sparkleCanvas);
  let glitter=null;
  function clearGlitter(){if(!glitter)return;scene.remove(glitter.points);glitter.points.geometry.dispose();glitter.points.material.dispose();glitter=null;}
  function celebrate(){
    clearGlitter();
    rings.forEach(ring=>ring.visible=false);
    active.updateWorldMatrix(true,true);
    const origin=active.userData.glitterSource.getWorldPosition(new THREE.Vector3());
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count=reduced?40:340,positions=new Float32Array(count*3),colors=new Float32Array(count*3),velocities=[];
    const palette=['#ffbf00','#ff239e','#9136ed','#00b8d9','#ffffff'];
    for(let i=0;i<count;i++){
      positions.set(origin.toArray(),i*3);
      const color=new THREE.Color(palette[i%palette.length]);colors.set(color.toArray(),i*3);
      const angle=Math.random()*Math.PI*2,speed=1.5+Math.random()*3.5;
      velocities.push(new THREE.Vector3(Math.cos(angle)*speed,1.8+Math.random()*3.5,Math.sin(angle)*speed));
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const material=new THREE.PointsMaterial({size:.55,map:sparkleTexture,vertexColors:true,transparent:true,depthWrite:false,fog:false,toneMapped:false,blending:THREE.NormalBlending});
    const points=new THREE.Points(geometry,material);points.frustumCulled=false;scene.add(points);
    glitter={points,origin,velocities,start:performance.now(),reduced};
  }
  function reset(){clearGlitter();rings.forEach(ring=>ring.visible=true);flight?.resolve();flight=null;active.rotation.set(0,0,0);active.userData.legs.forEach(leg=>leg.rotation.x=0);active.position.set((lane-1)*2.5,0,3);}
  function frame(time){const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;
    if(flight){const t=Math.min((time-flight.start)/(matchMedia('(prefers-reduced-motion: reduce)').matches?350:1400),1);active.position.set((flight.lane-1)*2.5,Math.sin(t*Math.PI)*1.15,3-5*t);active.rotation.x=-Math.sin(t*Math.PI)*.22;active.userData.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(t*Math.PI)*(i<2?-.65:.75));if(t===1){const done=flight.resolve;flight=null;active.rotation.x=0;done();}}
    else {const distance=(lane-1)*2.5-active.position.x;active.position.x+=distance*Math.min(1,dt*9);active.rotation.z=-Math.max(-.1,Math.min(.1,distance*.09));active.userData.legs.forEach((leg,i)=>leg.rotation.x=Math.abs(distance)>.03?Math.sin(time*.014+i*Math.PI)*.35:0);}
    if(glitter){
      const age=(time-glitter.start)/1000;
      if(age>2.4)clearGlitter();
      else{const positions=glitter.points.geometry.attributes.position;
        glitter.velocities.forEach((velocity,i)=>{const t=glitter.reduced?age*.15:age;positions.setXYZ(i,glitter.origin.x+velocity.x*t,glitter.origin.y+velocity.y*t-1.5*t*t,glitter.origin.z+velocity.z*t)});
        positions.needsUpdate=true;glitter.points.material.opacity=Math.min(1,Math.max(0,(2.4-age)/.7));
      }
    }
    const w=host.clientWidth,h=host.clientHeight;
    host.querySelectorAll('.answer-hoop').forEach((label,i)=>{const point=rings[i].position.clone().project(camera);label.style.left=`${(point.x+1)*w/2}px`;label.style.top=`${(1-point.y)*h/2}px`});
    renderer.render(scene,camera);
  }
  renderer.setAnimationLoop(frame);
  new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=camera.aspect<.8?55:43;const distance=Math.max(10,4.4/(Math.tan(camera.fov*Math.PI/360)*camera.aspect));camera.position.set(.3,4.2,distance);camera.lookAt(0,.8,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
    const labels=host.querySelectorAll('.answer-hoop');
    rings.forEach((ring,i)=>{const point=ring.position.clone().project(camera);if(labels[i]){labels[i].style.left=`${(point.x+1)*w/2}px`;labels[i].style.top=`${(1-point.y)*h/2}px`}})}).observe(host);
  return {celebrate,select(name){reset();active.visible=false;active=name==='pip'?pip:luna;active.visible=true;reset()},lane(i){lane=i;rings.forEach((r,j)=>r.material.emissive.set(j===i?'#493019':'#000000'))},reset,jump(i){reset();lane=i;return new Promise(resolve=>{flight={lane:i,start:performance.now(),resolve}})}};
}
