import * as THREE from './vendor/three.module.min.js';
export function createMeadow(host) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true,alpha:false}); } catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor('#c8eeff');
  renderer.domElement.setAttribute('aria-label','3D meadow with your animal and three answer gates');
  host.prepend(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,1,.1,100);
  camera.position.set(0,5.3,10);camera.lookAt(0,.8,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x779866,2.6));
  const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(-3,7,5);scene.add(sun);
  const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.7});
  function ball(parent,c,x,y,z,sx,sy= sx,sz=sx){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),mat(c));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;}
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),mat('#8cda9b'));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;scene.add(ground);
  const rings=[];
  [-2.5,0,2.5].forEach((x,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(.85,.12,12,48),mat(['#ba66e5','#f4ba38','#30bfa8'][i]));ring.position.set(x,1.4,0);scene.add(ring);rings.push(ring);ball(scene,'#e9d7fa',x,.03,0,1,.08,.65)});
  for(let i=0;i<20;i++){const x=(i%2?1:-1)*(4+Math.floor(i/2)*1.2);ball(scene,['#f7a4d4','#ffe278','#b4a2ee'][i%3],x,.18,-2-(i%5),.17);}
  function animal(dog){const g=new THREE.Group(),white=dog?'#fff0d9':'#fff5ff',accent=dog?'#ad7a50':'#e789cb';
    ball(g,white,0,.65,0,.43,.42,.65);
    for(const x of [-.26,.26])for(const z of [-.38,.38])ball(g,white,x,.28,z,.13,.3,.14);
    ball(g,white,0,1.18,-.36,.42,.44,.4);
    ball(g,white,0,1.05,-.67,.31,.22,.27);
    for(const x of [-.22,.22]){ball(g,'#302840',x,1.28,-.68,.065);ball(g,accent,x*(dog?1.9:1),dog?1.15:1.59,-.34,dog?.2:.12,dog?.38:.25,.13)}
    if(dog){ball(g,'#392c35',0,1.1,-.9,.1,.08,.07);ball(g,'#ef8fa7',0,.94,-.82,.08,.12,.05);for(let i=0;i<9;i++)ball(g,white,Math.sin(i*2)*.35,.85+Math.cos(i)*.2,Math.cos(i*2)*.4,.18);ball(g,accent,.08,.9,.65,.14,.28,.14)}
    else{const horn=new THREE.Mesh(new THREE.ConeGeometry(.11,.58,16),mat('#ffd65d'));horn.position.set(0,1.85,-.49);g.add(horn);for(let i=0;i<5;i++)ball(g,['#d998e7','#f1a2d3','#b6a0ed'][i%3],0,1.5-i*.16,-.03+i*.08,.2);ball(g,accent,0,.8,.75,.2,.42,.19)}
    // Turn towards the gates; the three-quarter camera keeps the model visible.
    return g;
  }
  const luna=animal(false),pip=animal(true);scene.add(luna,pip);pip.visible=false;
  let active=luna,lane=1,flight=null,lastTime=0;
  function reset(){flight?.resolve();flight=null;active.position.set((lane-1)*2.5,0,3);}
  function frame(time){const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;
    if(flight){const t=Math.min((time-flight.start)/(matchMedia('(prefers-reduced-motion: reduce)').matches?350:1400),1);active.position.set((flight.lane-1)*2.5,Math.sin(t*Math.PI)*1.15,3-5*t);active.rotation.x=-Math.sin(t*Math.PI)*.22;if(t===1){const done=flight.resolve;flight=null;active.rotation.x=0;done();}}
    else {active.position.x+=((lane-1)*2.5-active.position.x)*Math.min(1,dt*12);}
    const w=host.clientWidth,h=host.clientHeight;
    host.querySelectorAll('.answer-hoop').forEach((label,i)=>{const point=rings[i].position.clone().project(camera);label.style.left=`${(point.x+1)*w/2}px`;label.style.top=`${(1-point.y)*h/2}px`});
    renderer.render(scene,camera);
  }
  renderer.setAnimationLoop(frame);
  new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();camera.updateMatrixWorld();
    const labels=host.querySelectorAll('.answer-hoop');
    rings.forEach((ring,i)=>{const point=ring.position.clone().project(camera);if(labels[i]){labels[i].style.left=`${(point.x+1)*w/2}px`;labels[i].style.top=`${(1-point.y)*h/2}px`}})}).observe(host);
  return {select(name){reset();active.visible=false;active=name==='pip'?pip:luna;active.visible=true;reset()},lane(i){lane=i;rings.forEach((r,j)=>r.material.emissive.set(j===i?'#493019':'#000000'))},reset,jump(i){reset();lane=i;return new Promise(resolve=>{flight={lane:i,start:performance.now(),resolve}})}};
}
