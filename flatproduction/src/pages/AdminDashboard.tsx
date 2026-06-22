import React, { useEffect, useRef, useState } from 'react';
import { contentStore, type SiteContent, DEFAULT_SITE_CONTENT, toOneSentence } from '../store/contentStore';

/* ─────────────────────── Types & Helpers ──────────────────────── */
type SectionKey = 'overview'|'hero'|'about'|'services'|'portfolio'|'gallery'|'clients'|'team';
type ServiceItem   = SiteContent['services'][number];
type PortfolioItem = SiteContent['portfolio'][number];
type TeamItem      = SiteContent['team'][number];

const uid  = () => `id-${Math.random().toString(36).slice(2,9)}`;
const rand = (lo:number,hi:number) => Math.floor(Math.random()*(hi-lo+1))+lo;

function cloneContent(c:SiteContent):SiteContent {
  return {
    hero:        { ...c.hero, images:[...(c.hero.images??[])], notes:[...(c.hero.notes??[])] },
    about:       { ...c.about },
    services:    c.services.map(s=>({...s})),
    portfolio:   c.portfolio.map(p=>({...p})),
    clientsIntro:c.clientsIntro,
    clients:     [...c.clients],
    clientLogos: [...c.clientLogos],
    team:        c.team.map(m=>({...m})),
    gallery:     [...c.gallery],
  };
}
function move<T>(arr:T[],from:number,to:number):T[]{
  if(to<0||to>=arr.length)return arr;
  const n=[...arr];const[x]=n.splice(from,1);n.splice(to,0,x);return n;
}
const EMPTY_SVC = ():ServiceItem   => ({id:uid(),title:'New Service',  description:'',image:''});
const EMPTY_PF  = ():PortfolioItem => ({id:uid(),title:'New Project',  description:'',image:'',videoUrl:'',btsUrl:'',serviceId:'',category:'image'});
const EMPTY_TM  = ():TeamItem      => ({id:uid(),name:'Team Member',   role:'',bio:'',photo:'',position:'50% 20%'});

const IMG_SUGG=['photo1','photo3','photo12','photo14','live1','web','graphy33','kadaff','ike','chance','onekelly']
  .map(n=>`/${n}${n.startsWith('live')?'.jpeg':'.jpg'}`);
IMG_SUGG.push('/graphy33.jpg');
const VID_SUGG=['https://youtu.be/RjXqY31jpy0','https://youtu.be/de6oWk6vGlM'];
const BTS_SUGG=['https://youtu.be/DHR85WBk4tY','https://youtu.be/zWTFpxzQaes'];

/* ─────────────────────── Icons ────────────────────────────────── */
const I={
  Grid:   ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Info:   ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Work:   ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Layers: ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>,
  Img:    ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  Users:  ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Star:   ()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Up:     ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"/></svg>,
  Down:   ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>,
  Trash:  ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Plus:   ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Edit:   ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Ext:    ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>,
  Reset:  ()=><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  Upload: ()=><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  Out:    ()=><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Check:  ()=><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  Video:  ()=><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2"/></svg>,
  Search: ()=><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Filter: ()=><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

/* ─────────────────────── Button constants ──────────────────────── */
const b={
  primary: 'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111] text-white text-[0.78rem] font-bold cursor-pointer border-0 font-[inherit] transition-all hover:bg-[#333] active:scale-95',
  ghost:   'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#ddd] text-[#444] text-[0.78rem] font-semibold cursor-pointer font-[inherit] transition-all hover:border-[#111] hover:text-[#111]',
  danger:  'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#fca5a5] text-[#dc2626] text-[0.78rem] font-semibold cursor-pointer font-[inherit] transition-all hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626]',
  sm:      'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#111] text-white text-[0.72rem] font-bold cursor-pointer border-0 font-[inherit] transition-all hover:bg-[#333]',
  smGhost: 'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#ddd] text-[#555] text-[0.72rem] font-semibold cursor-pointer font-[inherit] transition-all hover:border-[#111] hover:text-[#111]',
  smDanger:'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#fca5a5] text-[#dc2626] text-[0.72rem] font-semibold cursor-pointer font-[inherit] transition-all hover:bg-[#dc2626] hover:text-white',
  icon:    'inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#e5e5e5] bg-white text-[#666] cursor-pointer font-[inherit] transition-all p-0 hover:border-[#111] hover:text-[#111] disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none',
  iconDng: 'inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#fca5a5] bg-white text-[#dc2626] cursor-pointer font-[inherit] transition-all p-0 hover:bg-[#dc2626] hover:text-white disabled:opacity-30',
  iconLt:  'inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 text-[#111] cursor-pointer p-0 font-[inherit] shadow transition-all hover:scale-110 disabled:opacity-30 disabled:pointer-events-none',
};

/* ─────────────────────── ImageField ────────────────────────────── */
const ImageField:React.FC<{value:string;onChange:(v:string)=>void;label?:string;className?:string}> =
  ({value,onChange,label='Image',className=''})=>{
  const [tab,setTab]=useState<'url'|'upload'>('url');
  const ref=useRef<HTMLInputElement>(null);
  const isB64=value?.startsWith('data:');

  const handleFile=(file:File)=>{
    if(file.size>4*1024*1024){alert('Max 4 MB. Please compress first.');return;}
    const r=new FileReader();
    r.onload=e=>{if(e.target?.result)onChange(e.target.result as string);};
    r.readAsDataURL(file);
  };

  return(
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[0.72rem] font-bold text-[#111] uppercase tracking-[0.08em]">{label}</label>
      {value&&(
        <div className="relative rounded-xl overflow-hidden border border-[#e5e5e5] bg-[#f5f5f5]" style={{aspectRatio:'16/7',maxHeight:110}}>
          <img src={value} alt="" className="w-full h-full object-cover"/>
          <button className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[0.6rem] flex items-center justify-center hover:bg-black cursor-pointer border-0 font-[inherit]" onClick={()=>onChange('')}>✕</button>
        </div>
      )}
      <div className="flex rounded-xl overflow-hidden border border-[#e5e5e5] text-[0.72rem] font-bold">
        {(['url','upload'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-1.5 cursor-pointer border-0 font-[inherit] transition-all ${tab===t?'bg-[#111] text-white':'bg-white text-[#999] hover:text-[#111]'}`}>
            {t==='url'?'🔗 URL':'⬆ Upload'}
          </button>
        ))}
      </div>
      {tab==='url'&&(
        <input type="text" value={isB64?'':(value??'')} onChange={e=>onChange(e.target.value)} placeholder="https://… or /photo.jpg"
          className="w-full py-2 px-3 border border-[#ddd] rounded-xl text-[0.82rem] text-[#111] outline-none font-[inherit] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)] transition-all"/>
      )}
      {tab==='upload'&&(
        <>
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])handleFile(e.target.files[0]);e.target.value='';}}/>
          <div onDrop={e=>{e.preventDefault();if(e.dataTransfer.files[0])handleFile(e.dataTransfer.files[0]);}} onDragOver={e=>e.preventDefault()} onClick={()=>ref.current?.click()}
            className="border-2 border-dashed border-[#ddd] rounded-xl py-5 text-center cursor-pointer hover:border-[#111] hover:bg-[#f9f9f9] transition-all">
            <I.Upload/>
            <p className="text-[0.75rem] text-[#999] mt-1.5">{isB64?'✓ Uploaded — click to replace':'Click or drag & drop (max 4 MB)'}</p>
          </div>
        </>
      )}
    </div>
  );
};

/* ─────────────────────── Field / Chips / UI ─────────────────────── */
const Field:React.FC<{label:string;children:React.ReactNode;className?:string}>=({label,children,className=''})=>(
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[0.72rem] font-bold text-[#111] uppercase tracking-[0.08em]">{label}</label>
    {React.Children.map(children,child=>{
      if(!React.isValidElement(child))return child;
      const el=child as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
      const isTA=el.type==='textarea';
      return React.cloneElement(el,{className:[
        'w-full py-2 px-3 border border-[#ddd] rounded-xl text-[0.82rem] text-[#111] bg-white outline-none font-[inherit] transition-all',
        'focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)] placeholder:text-[#bbb]',
        isTA?'resize-y min-h-[64px] leading-relaxed':'',
        (el.props.className??'') as string,
      ].join(' ')});
    })}
  </div>
);

const Chips:React.FC<{values:string[];onPick:(v:string)=>void;label?:string}>=({values,onPick,label})=>(
  <div className="mt-1">
    {label&&<p className="text-[0.63rem] text-[#bbb] font-bold uppercase tracking-widest mb-1">{label}</p>}
    <div className="flex flex-wrap gap-1">
      {values.map(v=>(
        <button key={v} type="button" onClick={()=>onPick(v)} title={v}
          className="bg-[#f5f5f5] border border-[#e5e5e5] text-[#666] py-[2px] px-2 rounded-full text-[0.65rem] font-mono cursor-pointer hover:border-[#111] hover:text-[#111] transition-all">
          {v.length>22?`…${v.slice(-16)}`:v}
        </button>
      ))}
    </div>
  </div>
);

const Card:React.FC<{children:React.ReactNode;className?:string}>=({children,className=''})=>(
  <div className={`bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm ${className}`}>{children}</div>
);

const Empty:React.FC<{label:string;onAdd:()=>void}>=({label,onAdd})=>(
  <div className="border-2 border-dashed border-[#e5e5e5] rounded-2xl py-12 text-center">
    <p className="text-[#ccc] text-sm mb-3">No {label} yet</p>
    <button className={b.primary} onClick={onAdd}><I.Plus/>Add {label}</button>
  </div>
);

/* ─────────────────────── Modal Shell ───────────────────────────── */
const ModalShell:React.FC<{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}> =
  ({title,onClose,children,wide})=>{
  useEffect(()=>{
    document.body.style.overflow='hidden';
    const k=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',k);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',k);};
  },[onClose]);
  return(
    <div className="fixed inset-0 z-[6000] bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-h-[92vh] overflow-y-auto ${wide?'max-w-[680px]':'max-w-[520px]'}`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb] sticky top-0 bg-white z-10">
          <h3 className="text-[#111] font-bold text-[0.95rem]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[#e5e5e5] flex items-center justify-center text-[#888] hover:text-[#111] hover:border-[#111] transition-all cursor-pointer bg-transparent font-[inherit] text-sm">✕</button>
        </div>
        <div className="p-6 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────── Confirm Delete Modal ──────────────────── */
const ConfirmModal:React.FC<{label:string;onConfirm:()=>void;onClose:()=>void}>=({label,onConfirm,onClose})=>(
  <ModalShell title="Confirm Delete" onClose={onClose}>
    <div className="text-center py-4">
      <div className="w-14 h-14 rounded-full bg-[#fef2f2] border-2 border-[#fca5a5] flex items-center justify-center mx-auto mb-4"><I.Trash/></div>
      <p className="text-[#111] font-bold text-base mb-1">Delete "{label}"?</p>
      <p className="text-[#888] text-sm">This action cannot be undone.</p>
    </div>
    <div className="flex gap-2 justify-center">
      <button className={b.ghost} onClick={onClose}>Cancel</button>
      <button className={b.danger} onClick={()=>{onConfirm();onClose();}}>Yes, Delete</button>
    </div>
  </ModalShell>
);

/* ─────────────────────── Service Modal ─────────────────────────── */
const ServiceModal:React.FC<{initial?:ServiceItem;onSave:(item:ServiceItem)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [t,setT]=useState(initial?.title??'');
  const [d,setD]=useState(initial?.description??'');
  const [img,setImg]=useState(initial?.image??'');
  return(
    <ModalShell title={initial?'Edit Service':'Add Service'} onClose={onClose}>
      <ImageField value={img} onChange={setImg}/>
      <Chips label="Quick pick" values={IMG_SUGG} onPick={setImg}/>
      <Field label="Title"><input value={t} onChange={e=>setT(e.target.value)} placeholder="Service name"/></Field>
      <Field label="Description"><textarea rows={3} value={d} onChange={e=>setD(e.target.value)} placeholder="Brief description"/></Field>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(t.trim())onSave({id:initial?.id??uid(),title:t,description:d,image:img});}}>
          {initial?'Save Changes':'Add Service'}
        </button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────── Portfolio Modal ───────────────────────── */
const PortfolioModal:React.FC<{initial?:PortfolioItem;services:ServiceItem[];onSave:(item:PortfolioItem)=>void;onClose:()=>void}> =
  ({initial,services,onSave,onClose})=>{
  const [t,setT]=useState(initial?.title??'');
  const [d,setD]=useState(initial?.description??'');
  const [img,setImg]=useState(initial?.image??'');
  const [vid,setVid]=useState(initial?.videoUrl??'');
  const [bts,setBts]=useState(initial?.btsUrl??'');
  const [svc,setSvc]=useState(initial?.serviceId??'');
  return(
    <ModalShell title={initial?'Edit Project':'Add Project'} wide onClose={onClose}>
      <ImageField value={img} onChange={setImg} label="Thumbnail / Cover Image"/>
      <Chips label="Quick pick" values={IMG_SUGG} onPick={setImg}/>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Project Title"><input value={t} onChange={e=>setT(e.target.value)} placeholder="Title"/></Field>
        <div className="flex flex-col gap-1">
          <label className="text-[0.72rem] font-bold text-[#111] uppercase tracking-[0.08em]">Link to Service</label>
          <select value={svc} onChange={e=>setSvc(e.target.value)}
            className="w-full py-2 px-3 border border-[#ddd] rounded-xl text-[0.82rem] text-[#111] bg-white outline-none font-[inherit] focus:border-[#111] transition-all">
            <option value="">— No service linked —</option>
            {services.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
      </div>
      <Field label="Description"><textarea rows={2} value={d} onChange={e=>setD(e.target.value)} placeholder="One sentence description…"/></Field>
      <div className="border-t border-[#f0f0f0] pt-4">
        <p className="text-[0.72rem] font-bold text-[#111] uppercase tracking-[0.08em] mb-3">Video Links (optional)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Field label="Main Video (YouTube)"><input value={vid} onChange={e=>setVid(e.target.value)} placeholder="https://youtu.be/…"/></Field>
            <Chips values={VID_SUGG} onPick={setVid}/>
          </div>
          <div>
            <Field label="Behind-the-Scenes URL"><input value={bts} onChange={e=>setBts(e.target.value)} placeholder="https://youtu.be/…"/></Field>
            <Chips values={BTS_SUGG} onPick={setBts}/>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(t.trim())onSave({id:initial?.id??uid(),title:t,description:toOneSentence(d),image:img,videoUrl:vid,btsUrl:bts,serviceId:svc,category:vid?'video':'image'});}}>
          {initial?'Save Changes':'Add Project'}
        </button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────── Hero Slide Modal ──────────────────────── */
const SlideModal:React.FC<{initial?:{image:string;note:string};onSave:(image:string,note:string)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [img,setImg]=useState(initial?.image??'');
  const [note,setNote]=useState(initial?.note??'');
  return(
    <ModalShell title={initial?'Edit Slide':'Add Hero Slide'} onClose={onClose}>
      <ImageField value={img} onChange={setImg} label="Slide Background Image"/>
      <Chips label="Quick pick" values={IMG_SUGG} onPick={setImg}/>
      <Field label="Caption / Note"><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Short slide caption"/></Field>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(img.trim())onSave(img,note);}}>
          {initial?'Save Changes':'Add Slide'}
        </button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────── Gallery Modal ─────────────────────────── */
const GalleryModal:React.FC<{initial?:string;index?:number;onSave:(url:string)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [url,setUrl]=useState(initial??'');
  return(
    <ModalShell title={initial!==undefined?'Edit Image':'Add Gallery Image'} onClose={onClose}>
      <ImageField value={url} onChange={setUrl} label="Image"/>
      <Chips label="Quick pick" values={IMG_SUGG} onPick={setUrl}/>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(url.trim())onSave(url);}}>
          {initial!==undefined?'Save Changes':'Add Image'}
        </button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────── Team Member Modal ─────────────────────── */
const TeamModal:React.FC<{initial?:TeamItem;onSave:(item:TeamItem)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [name,setName]=useState(initial?.name??'');
  const [role,setRole]=useState(initial?.role??'');
  const [bio,setBio]=useState(initial?.bio??'');
  const [photo,setPhoto]=useState(initial?.photo??'');
  return(
    <ModalShell title={initial?'Edit Member':'Add Team Member'} onClose={onClose}>
      <ImageField value={photo} onChange={setPhoto} label="Photo"/>
      <Chips label="Quick pick" values={IMG_SUGG} onPick={setPhoto}/>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/></Field>
        <Field label="Role / Position"><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role"/></Field>
      </div>
      <Field label="Short Bio"><textarea rows={2} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Brief bio…"/></Field>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(name.trim())onSave({id:initial?.id??uid(),name,role,bio,photo,position:initial?.position??'50% 20%'});}}>
          {initial?'Save Changes':'Add Member'}
        </button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────── Logo Modal ────────────────────────────── */
const LogoModal:React.FC<{initial?:string;onSave:(url:string)=>void;onClose:()=>void}>=({initial,onSave,onClose})=>{
  const [url,setUrl]=useState(initial??'');
  return(
    <ModalShell title={initial!==undefined?'Edit Logo':'Add Client Logo'} onClose={onClose}>
      <ImageField value={url} onChange={setUrl} label="Logo Image"/>
      <Chips label="Quick pick" values={IMG_SUGG} onPick={setUrl}/>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(url.trim())onSave(url);}}>{initial!==undefined?'Save':'Add Logo'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────── Overview ──────────────────────────────── */
const Overview:React.FC<{draft:SiteContent;go:(s:SectionKey)=>void}>=({draft,go})=>{
  const lsKb=React.useMemo(()=>{
    try{let s=0;for(const k in localStorage){if(Object.prototype.hasOwnProperty.call(localStorage,k))s+=localStorage[k].length*2;}return Math.round(s/1024);}catch{return 0;}
  },[]);

  const stats=[
    {label:'Hero Slides', n:draft.hero.images?.length??0,  section:'hero'      as SectionKey,emoji:'🎬'},
    {label:'Services',     n:draft.services.length,          section:'services'  as SectionKey,emoji:'💼'},
    {label:'Projects',     n:draft.portfolio.length,         section:'portfolio' as SectionKey,emoji:'📁'},
    {label:'Gallery',      n:draft.gallery.length,           section:'gallery'   as SectionKey,emoji:'🖼'},
    {label:'Team Members', n:draft.team.length,              section:'team'      as SectionKey,emoji:'👥'},
    {label:'Client Logos', n:draft.clientLogos.length,       section:'clients'   as SectionKey,emoji:'⭐'},
  ];

  const health=[
    {label:'Hero slides set',          ok:(draft.hero.images?.length??0)>0},
    {label:'Hero headline & subtitle', ok:!!draft.hero.title&&!!draft.hero.subtitle},
    {label:'About section filled',     ok:!!draft.about.heading&&!!draft.about.body},
    {label:'At least 1 service',       ok:draft.services.length>0},
    {label:'All services have images', ok:draft.services.every(s=>!!s.image)},
    {label:'Portfolio projects added', ok:draft.portfolio.length>0},
    {label:'Gallery images uploaded',  ok:draft.gallery.length>0},
    {label:'Team members added',       ok:draft.team.length>0},
    {label:'Client logos set',         ok:draft.clientLogos.length>0},
  ];
  const score=health.filter(h=>h.ok).length;
  const videoProjects=draft.portfolio.filter(p=>p.videoUrl).length;
  const linkedProjects=draft.portfolio.filter(p=>p.serviceId).length;

  return(
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[#111] font-bold text-xl tracking-tight">Dashboard Overview</h2>
          <p className="text-[#888] text-sm mt-0.5">Flat Productions · Content Management</p>
        </div>
        <div className="bg-white border border-[#ebebeb] rounded-2xl px-5 py-3 text-right shadow-sm">
          <p className="text-[#111] font-bold text-2xl leading-none">{score}<span className="text-[#ccc]">/{health.length}</span></p>
          <p className="text-[#888] text-[0.72rem] mt-0.5">Content health</p>
          <div className="mt-2 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden w-24">
            <div className="h-full bg-[#111] rounded-full" style={{width:`${(score/health.length)*100}%`}}/>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map(s=>(
          <button key={s.section} onClick={()=>go(s.section)}
            className="bg-white border border-[#ebebeb] rounded-2xl p-5 text-left hover:border-[#111] hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-[0.62rem] font-bold text-[#ccc] group-hover:text-[#111] uppercase tracking-wider transition-colors">Manage →</span>
            </div>
            <p className="text-[#111] font-bold text-3xl leading-none">{s.n}</p>
            <p className="text-[#888] text-[0.75rem] mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Extra metrics */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {label:'Video Projects', n:videoProjects, sub:'in portfolio'},
          {label:'Linked to Service', n:linkedProjects, sub:'portfolio items'},
          {label:'Storage Used', n:`${lsKb} KB`, sub:'of ~5,000 KB'},
        ].map(m=>(
          <div key={m.label} className="bg-white border border-[#ebebeb] rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-[#111] font-bold text-2xl leading-none">{m.n}</p>
            <p className="text-[#888] text-[0.75rem] mt-0.5">{m.label}</p>
            <p className="text-[#ccc] text-[0.65rem]">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Health + recent */}
      <div className="grid grid-cols-[1fr_260px] gap-5">
        <Card>
          <p className="text-[#111] font-bold text-[0.85rem] mb-4">Content Health</p>
          {health.map(h=>(
            <div key={h.label} className="flex items-center gap-2.5 py-2 border-b border-[#f8f8f8] last:border-0">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${h.ok?'bg-[#111]':'border-2 border-[#e0e0e0]'}`}>
                {h.ok&&<I.Check/>}
              </div>
              <span className={`text-[0.82rem] flex-1 ${h.ok?'text-[#111]':'text-[#aaa]'}`}>{h.label}</span>
              {!h.ok&&<span className="text-[0.65rem] font-bold text-[#dc2626] bg-[#fef2f2] px-2 py-0.5 rounded-full">Needs attention</span>}
            </div>
          ))}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-[#111] font-bold text-[0.85rem] mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              {(['services','portfolio','gallery','team','clients','hero'] as SectionKey[]).map(s=>(
                <button key={s} onClick={()=>go(s)}
                  className="text-left px-3 py-2.5 rounded-xl border border-[#ebebeb] text-[0.78rem] font-semibold text-[#555] hover:bg-[#111] hover:text-white hover:border-[#111] transition-all cursor-pointer font-[inherit] flex items-center justify-between group">
                  <span>Manage {s.charAt(0).toUpperCase()+s.slice(1)}</span>
                  <span className="text-[#ddd] group-hover:text-white/40">→</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[#111] font-bold text-[0.85rem] mb-3">Recent Services</p>
            <div className="flex flex-col gap-2">
              {draft.services.slice(-3).reverse().map(s=>(
                <div key={s.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                    {s.image&&<img src={s.image} alt="" className="w-full h-full object-cover"/>}
                  </div>
                  <p className="text-[0.78rem] text-[#111] font-semibold truncate">{s.title}</p>
                </div>
              ))}
              {!draft.services.length&&<p className="text-[#ccc] text-[0.75rem]">No services yet</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── Search / Filter bar ───────────────────── */
const SearchBar:React.FC<{query:string;setQuery:(v:string)=>void;placeholder?:string;children?:React.ReactNode}> =
  ({query,setQuery,placeholder='Search…',children})=>(
  <div className="flex items-center gap-2 mb-5">
    <div className="relative flex-1 max-w-xs">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]"><I.Search/></span>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 border border-[#e5e5e5] rounded-xl text-[0.82rem] text-[#111] bg-white outline-none font-[inherit] focus:border-[#111] transition-all"/>
    </div>
    {children}
    {query&&<button onClick={()=>setQuery('')} className={b.smGhost}>Clear</button>}
  </div>
);

/* ─────────────────────── Main Component ───────────────────────── */
type Modal =
  |null
  |{k:'add-svc'}|{k:'edit-svc';i:number}
  |{k:'add-pf'}|{k:'edit-pf';i:number}
  |{k:'add-slide'}|{k:'edit-slide';i:number}
  |{k:'add-gal'}|{k:'edit-gal';i:number}
  |{k:'add-tm'}|{k:'edit-tm';i:number}
  |{k:'add-logo'}|{k:'edit-logo';i:number}
  |{k:'del';label:string;onConfirm:()=>void};

const NAV:[SectionKey,string,()=>React.ReactElement,(d:SiteContent)=>number][]=[
  ['overview','Overview',I.Grid,  _=>0],
  ['hero',    'Hero',   I.Img,   d=>d.hero.images?.length??0],
  ['about',   'About',  I.Info,  _=>1],
  ['services','Services',I.Work, d=>d.services.length],
  ['portfolio','Portfolio',I.Layers,d=>d.portfolio.length],
  ['gallery','Gallery',I.Img,   d=>d.gallery.length],
  ['clients','Clients',I.Star,  d=>d.clients.length+d.clientLogos.length],
  ['team',   'Team',   I.Users, d=>d.team.length],
];

const AdminDashboard:React.FC=()=>{
  const [active,setActive]=useState<SectionKey>('overview');
  const [draft,setDraft]=useState<SiteContent>(()=>cloneContent(contentStore.read()));
  const [modal,setModal]=useState<Modal>(null);
  const [saved,setSaved]=useState(true);
  const [query,setQuery]=useState('');
  const [pfSvcFilter,setPfSvcFilter]=useState('');
  const [pfTypeFilter,setPfTypeFilter]=useState('');

  useEffect(()=>{ contentStore.onUpdate(c=>setDraft(cloneContent(c))); },[]);
  useEffect(()=>{ setQuery(''); setPfSvcFilter(''); setPfTypeFilter(''); },[active]);

  const persist=(next:SiteContent)=>{
    const s=cloneContent(next);
    setDraft(s);
    contentStore.write(s);
    setSaved(false);
    setTimeout(()=>setSaved(true),1200);
  };

  /* hero */
  const imgs=()=>draft.hero.images??[];
  const nts=()=>draft.hero.notes??[];
  const setHero=(f:'title'|'subtitle',v:string)=>persist({...draft,hero:{...draft.hero,[f]:v}});
  const addSlide=(img:string,note:string)=>persist({...draft,hero:{...draft.hero,images:[...imgs(),img],notes:[...nts(),note]}});
  const editSlide=(i:number,img:string,note:string)=>persist({...draft,hero:{...draft.hero,images:imgs().map((x,j)=>j===i?img:x),notes:nts().map((x,j)=>j===i?note:x)}});
  const moveSlide=(i:number,d:-1|1)=>persist({...draft,hero:{...draft.hero,images:move(imgs(),i,i+d),notes:move(nts(),i,i+d)}});
  const delSlide=(i:number)=>persist({...draft,hero:{...draft.hero,images:imgs().filter((_,j)=>j!==i),notes:nts().filter((_,j)=>j!==i)}});

  /* about */
  const setAbout=(f:'heading'|'body',v:string)=>persist({...draft,about:{...draft.about,[f]:v}});

  /* services */
  const saveSvc=(item:ServiceItem,i?:number)=>persist({...draft,services:i===undefined?[...draft.services,item]:draft.services.map((s,j)=>j===i?item:s)});
  const moveSvc=(i:number,d:-1|1)=>persist({...draft,services:move(draft.services,i,i+d)});
  const delSvc=(i:number)=>persist({...draft,services:draft.services.filter((_,j)=>j!==i)});

  /* portfolio */
  const savePf=(item:PortfolioItem,i?:number)=>persist({...draft,portfolio:i===undefined?[...draft.portfolio,item]:draft.portfolio.map((p,j)=>j===i?item:p)});
  const movePf=(i:number,d:-1|1)=>persist({...draft,portfolio:move(draft.portfolio,i,i+d)});
  const delPf=(i:number)=>persist({...draft,portfolio:draft.portfolio.filter((_,j)=>j!==i)});

  /* gallery */
  const saveGal=(url:string,i?:number)=>persist({...draft,gallery:i===undefined?[...draft.gallery,url]:draft.gallery.map((x,j)=>j===i?url:x)});
  const moveGal=(i:number,d:-1|1)=>persist({...draft,gallery:move(draft.gallery,i,i+d)});
  const delGal=(i:number)=>persist({...draft,gallery:draft.gallery.filter((_,j)=>j!==i)});

  /* clients */
  const setIntro=(v:string)=>persist({...draft,clientsIntro:v});
  const setClient=(i:number,v:string)=>persist({...draft,clients:draft.clients.map((x,j)=>j===i?v:x)});
  const addClient=()=>persist({...draft,clients:[...draft.clients,'New Client']});
  const delClient=(i:number)=>persist({...draft,clients:draft.clients.filter((_,j)=>j!==i)});
  const saveLogo=(url:string,i?:number)=>persist({...draft,clientLogos:i===undefined?[...draft.clientLogos,url]:draft.clientLogos.map((x,j)=>j===i?url:x)});
  const moveLogo=(i:number,d:-1|1)=>persist({...draft,clientLogos:move(draft.clientLogos,i,i+d)});
  const delLogo=(i:number)=>persist({...draft,clientLogos:draft.clientLogos.filter((_,j)=>j!==i)});

  /* team */
  const saveTm=(item:TeamItem,i?:number)=>persist({...draft,team:i===undefined?[...draft.team,item]:draft.team.map((m,j)=>j===i?item:m)});
  const moveTm=(i:number,d:-1|1)=>persist({...draft,team:move(draft.team,i,i+d)});
  const delTm=(i:number)=>persist({...draft,team:draft.team.filter((_,j)=>j!==i)});

  const logout=()=>{sessionStorage.removeItem('flat_admin_auth');window.location.pathname='/login';};
  const preview=()=>window.open('/','_blank','noopener,noreferrer');

  /* ── Filtered lists ── */
  const q=query.toLowerCase();
  const filteredSvc=draft.services.filter(s=>!q||s.title.toLowerCase().includes(q)||s.description.toLowerCase().includes(q));
  const filteredPf=draft.portfolio.filter(p=>{
    if(q&&!p.title.toLowerCase().includes(q)&&!(p.description??'').toLowerCase().includes(q))return false;
    if(pfSvcFilter&&p.serviceId!==pfSvcFilter)return false;
    if(pfTypeFilter==='video'&&!p.videoUrl)return false;
    if(pfTypeFilter==='image'&&p.videoUrl)return false;
    return true;
  });
  const filteredGal=draft.gallery.filter(img=>!q||img.toLowerCase().includes(q));
  const filteredTm=draft.team.filter(m=>!q||m.name.toLowerCase().includes(q)||m.role.toLowerCase().includes(q));

  const navLabel=NAV.find(n=>n[0]===active)?.[1]??active;

  return(
    <div className="flex h-screen overflow-hidden bg-white">

      {/* ═══ SIDEBAR ═══════════════════════════════════════════════ */}
      <aside className="w-[240px] flex-shrink-0 bg-[#0a0a0a] flex flex-col h-screen border-r border-white/[0.06]">
        <div className="px-4 py-5 border-b border-white/[0.06] flex items-center gap-2.5">
          <img src="/flat production.jpg.jpeg" alt="" className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10"/>
          <div><p className="text-white font-bold text-[0.85rem]">Flat Admin</p><p className="text-white/30 text-[0.62rem]">Content Manager</p></div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-white/20 text-[0.6rem] font-bold uppercase tracking-widest px-2 mb-2">Sections</p>
          {NAV.map(([key,label,Icon,count])=>{
            const isA=active===key;
            const n=count(draft);
            return(
              <button key={key} onClick={()=>setActive(key)}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2.5 rounded-xl text-[0.8rem] font-semibold cursor-pointer border-0 font-[inherit] transition-all text-left mb-0.5 ${isA?'bg-white text-[#0a0a0a]':'bg-transparent text-white/45 hover:bg-white/[0.06] hover:text-white'}`}>
                <span className={isA?'text-[#0a0a0a]':'text-white/30'}><Icon/></span>
                <span className="flex-1">{label}</span>
                {key!=='overview'&&<span className={`text-[0.62rem] font-bold px-1.5 py-0.5 rounded-full ${isA?'bg-[#111] text-white':'bg-white/10 text-white/40'}`}>{n}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/[0.06] flex flex-col gap-2">
          <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl bg-white/[0.06] border-0 text-white/60 cursor-pointer text-[0.75rem] font-semibold font-[inherit] transition-all hover:bg-white/10 hover:text-white" onClick={preview}><I.Ext/>Preview Site</button>
          <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl bg-transparent border border-white/[0.08] text-white/40 cursor-pointer text-[0.75rem] font-semibold font-[inherit] transition-all hover:border-[#ef4444]/50 hover:text-[#ef4444]" onClick={logout}><I.Out/>Sign out</button>
        </div>
      </aside>

      {/* ═══ MAIN ═══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8f8f8]">

        {/* Header */}
        <header className="bg-white border-b border-[#ebebeb] px-6 h-[58px] flex items-center justify-between flex-shrink-0">
          <div><h2 className="text-[#111] font-bold text-[0.92rem]">{navLabel}</h2><p className="text-[#bbb] text-[0.68rem]">Admin › {active}</p></div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold border transition-all ${saved?'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]':'bg-[#fefce8] text-[#854d0e] border-[#fde68a]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${saved?'bg-[#22c55e]':'bg-[#eab308] animate-pulse'}`}/>
              {saved?'Saved':'Saving…'}
            </span>
            <button className={b.ghost} onClick={()=>persist(cloneContent(DEFAULT_SITE_CONTENT))}><I.Reset/>Reset All</button>
            <button className={b.primary} onClick={preview}><I.Ext/>Preview</button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[920px] mx-auto">

            {/* ── OVERVIEW ── */}
            {active==='overview'&&<Overview draft={draft} go={setActive}/>}

            {/* ── HERO ── */}
            {active==='hero'&&(
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111] font-bold text-[0.92rem]">Hero Slides <span className="text-[#bbb] font-normal">({imgs().length})</span></h3>
                  <button className={b.primary} onClick={()=>setModal({k:'add-slide'})}><I.Plus/>Add Slide</button>
                </div>
                <Card className="mb-4">
                  <p className="text-[0.72rem] font-bold text-[#aaa] uppercase tracking-widest mb-3">Page Text</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Headline"><input value={draft.hero.title} onChange={e=>setHero('title',e.target.value)} placeholder="Main headline"/></Field>
                    <Field label="Subtitle"><textarea rows={2} value={draft.hero.subtitle} onChange={e=>setHero('subtitle',e.target.value)} placeholder="Subtitle…"/></Field>
                  </div>
                </Card>
                {imgs().length===0&&<Empty label="slide" onAdd={()=>setModal({k:'add-slide'})}/>}
                <div className="flex flex-col gap-2">
                  {imgs().map((img,i)=>(
                    <div key={`${img}-${i}`} className="bg-white border border-[#ebebeb] rounded-2xl flex items-center gap-4 p-3 shadow-sm hover:border-[#ddd] transition-all">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                        {img&&<img src={img} alt="" className="w-full h-full object-cover"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#111] font-semibold text-[0.82rem]">Slide {i+1}</p>
                        <p className="text-[#aaa] text-[0.75rem] truncate">{nts()[i]||'No caption'}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button className={b.icon} onClick={()=>moveSlide(i,-1)} disabled={i===0}><I.Up/></button>
                        <button className={b.icon} onClick={()=>moveSlide(i,1)} disabled={i===imgs().length-1}><I.Down/></button>
                        <button className={b.icon} onClick={()=>setModal({k:'edit-slide',i})}><I.Edit/></button>
                        <button className={b.iconDng} onClick={()=>setModal({k:'del',label:`Slide ${i+1}`,onConfirm:()=>delSlide(i)})}><I.Trash/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ABOUT ── */}
            {active==='about'&&(
              <div>
                <h3 className="text-[#111] font-bold text-[0.92rem] mb-4">About Section</h3>
                <Card>
                  <div className="flex flex-col gap-4">
                    <Field label="Heading"><input value={draft.about.heading} onChange={e=>setAbout('heading',e.target.value)}/></Field>
                    <Field label="Body Content"><textarea rows={8} value={draft.about.body} onChange={e=>setAbout('body',e.target.value)}/></Field>
                  </div>
                </Card>
              </div>
            )}

            {/* ── SERVICES ── */}
            {active==='services'&&(
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111] font-bold text-[0.92rem]">Services <span className="text-[#bbb] font-normal">({draft.services.length})</span></h3>
                  <button className={b.primary} onClick={()=>setModal({k:'add-svc'})}><I.Plus/>Add Service</button>
                </div>
                <SearchBar query={query} setQuery={setQuery} placeholder="Search services…"/>
                {filteredSvc.length===0&&(query?<p className="text-[#bbb] text-sm text-center py-10">No services match "{query}"</p>:<Empty label="service" onAdd={()=>setModal({k:'add-svc'})}/>)}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSvc.map((svc)=>{
                    const i=draft.services.indexOf(svc);
                    return(
                      <div key={svc.id} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm hover:border-[#ddd] hover:shadow-md transition-all group">
                        <div className="aspect-[4/3] bg-[#f5f5f5] overflow-hidden">
                          {svc.image?<img src={svc.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>:<div className="w-full h-full flex items-center justify-center text-[#ddd] text-4xl">🖼</div>}
                        </div>
                        <div className="p-4">
                          <p className="text-[#111] font-bold text-[0.85rem] mb-1">{svc.title}</p>
                          <p className="text-[#888] text-[0.75rem] leading-relaxed line-clamp-2 mb-3">{svc.description}</p>
                          <div className="flex gap-1.5">
                            <button className={b.icon} onClick={()=>moveSvc(i,-1)} disabled={i===0}><I.Up/></button>
                            <button className={b.icon} onClick={()=>moveSvc(i,1)} disabled={i===draft.services.length-1}><I.Down/></button>
                            <button className={`${b.icon} flex-1 !w-auto px-2 text-[0.72rem] font-semibold`} onClick={()=>setModal({k:'edit-svc',i})}><I.Edit/>Edit</button>
                            <button className={b.iconDng} onClick={()=>setModal({k:'del',label:svc.title,onConfirm:()=>delSvc(i)})}><I.Trash/></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PORTFOLIO ── */}
            {active==='portfolio'&&(
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111] font-bold text-[0.92rem]">Portfolio <span className="text-[#bbb] font-normal">({draft.portfolio.length})</span></h3>
                  <button className={b.primary} onClick={()=>setModal({k:'add-pf'})}><I.Plus/>Add Project</button>
                </div>
                <SearchBar query={query} setQuery={setQuery} placeholder="Search projects…">
                  <select value={pfSvcFilter} onChange={e=>setPfSvcFilter(e.target.value)}
                    className="py-2 px-3 border border-[#e5e5e5] rounded-xl text-[0.78rem] text-[#555] bg-white outline-none font-[inherit] focus:border-[#111] cursor-pointer">
                    <option value="">All services</option>
                    {draft.services.map(s=><option key={s.id} value={s.id}>{s.title.split(' ').slice(0,3).join(' ')}</option>)}
                  </select>
                  <select value={pfTypeFilter} onChange={e=>setPfTypeFilter(e.target.value)}
                    className="py-2 px-3 border border-[#e5e5e5] rounded-xl text-[0.78rem] text-[#555] bg-white outline-none font-[inherit] focus:border-[#111] cursor-pointer">
                    <option value="">All types</option>
                    <option value="video">Video only</option>
                    <option value="image">Image only</option>
                  </select>
                </SearchBar>
                {filteredPf.length===0&&(query||pfSvcFilter||pfTypeFilter?<p className="text-[#bbb] text-sm text-center py-10">No projects match filters</p>:<Empty label="project" onAdd={()=>setModal({k:'add-pf'})}/>)}
                <div className="flex flex-col gap-3">
                  {filteredPf.map((pf)=>{
                    const i=draft.portfolio.indexOf(pf);
                    const linkedSvc=draft.services.find(s=>s.id===pf.serviceId);
                    return(
                      <div key={pf.id} className="bg-white border border-[#ebebeb] rounded-2xl flex items-center gap-4 p-3 shadow-sm hover:border-[#ddd] transition-all">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                          {pf.image&&<img src={pf.image} alt="" className="w-full h-full object-cover"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-[#111] font-bold text-[0.85rem]">{pf.title}</p>
                            {pf.videoUrl&&<span className="flex items-center gap-0.5 text-[0.62rem] font-bold bg-[#111] text-white px-1.5 py-0.5 rounded-full"><I.Video/>Video</span>}
                            {linkedSvc&&<span className="text-[0.62rem] font-bold bg-[#f0f0f0] text-[#555] px-2 py-0.5 rounded-full">🔗 {linkedSvc.title.split(' ')[0]}</span>}
                          </div>
                          <p className="text-[#aaa] text-[0.75rem] truncate">{pf.description||'No description'}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button className={b.icon} onClick={()=>movePf(i,-1)} disabled={i===0}><I.Up/></button>
                          <button className={b.icon} onClick={()=>movePf(i,1)} disabled={i===draft.portfolio.length-1}><I.Down/></button>
                          <button className={`${b.icon} !w-auto px-2 text-[0.72rem] font-semibold`} onClick={()=>setModal({k:'edit-pf',i})}><I.Edit/>Edit</button>
                          <button className={b.iconDng} onClick={()=>setModal({k:'del',label:pf.title,onConfirm:()=>delPf(i)})}><I.Trash/></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── GALLERY ── */}
            {active==='gallery'&&(
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111] font-bold text-[0.92rem]">Gallery <span className="text-[#bbb] font-normal">({draft.gallery.length})</span></h3>
                  <button className={b.primary} onClick={()=>setModal({k:'add-gal'})}><I.Plus/>Add Image</button>
                </div>
                <SearchBar query={query} setQuery={setQuery} placeholder="Filter by filename…"/>
                {filteredGal.length===0&&(query?<p className="text-[#bbb] text-sm text-center py-10">No images match</p>:<Empty label="gallery image" onAdd={()=>setModal({k:'add-gal'})}/>)}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
                  {filteredGal.map((img)=>{
                    const i=draft.gallery.indexOf(img);
                    return(
                      <div key={`${img}-${i}`} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm group hover:border-[#ddd] transition-all">
                        <div className="relative aspect-square bg-[#f5f5f5]">
                          {img&&<img src={img} alt="" className="w-full h-full object-cover"/>}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button className={b.iconLt} onClick={()=>moveGal(i,-1)} disabled={i===0}><I.Up/></button>
                            <button className={b.iconLt} onClick={()=>moveGal(i,1)} disabled={i===draft.gallery.length-1}><I.Down/></button>
                            <button className={b.iconLt} onClick={()=>setModal({k:'edit-gal',i})}><I.Edit/></button>
                            <button className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#dc2626] text-white cursor-pointer p-0 font-[inherit] transition-all hover:scale-110" onClick={()=>setModal({k:'del',label:`Image ${i+1}`,onConfirm:()=>delGal(i)})}><I.Trash/></button>
                          </div>
                        </div>
                        <p className="text-[#bbb] text-[0.65rem] truncate px-2 py-1.5 font-mono">{img.split('/').pop()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CLIENTS ── */}
            {active==='clients'&&(
              <div className="flex flex-col gap-5">
                <h3 className="text-[#111] font-bold text-[0.92rem]">Clients</h3>
                <Card>
                  <p className="text-[0.72rem] font-bold text-[#aaa] uppercase tracking-widest mb-3">Intro Text</p>
                  <Field label="Introduction"><textarea rows={3} value={draft.clientsIntro} onChange={e=>setIntro(e.target.value)}/></Field>
                </Card>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#111] font-bold text-[0.85rem]">Client Tags <span className="text-[#bbb] font-normal">({draft.clients.length})</span></p>
                    <button className={b.sm} onClick={addClient}><I.Plus/>Add Tag</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {draft.clients.map((c,i)=>(
                      <div key={i} className="flex items-center gap-2 bg-white border border-[#ebebeb] rounded-xl px-3 py-2.5">
                        <span className="text-[0.68rem] font-bold text-[#ccc] w-5 flex-shrink-0">{i+1}</span>
                        <input value={c} onChange={e=>setClient(i,e.target.value)} className="flex-1 bg-transparent text-[0.82rem] text-[#111] outline-none font-[inherit] border-0"/>
                        <button className={b.iconDng} onClick={()=>setModal({k:'del',label:c,onConfirm:()=>delClient(i)})}><I.Trash/></button>
                      </div>
                    ))}
                    {!draft.clients.length&&<p className="text-[#ccc] text-sm py-4 text-center">No client tags — add one</p>}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#111] font-bold text-[0.85rem]">Client Logos <span className="text-[#bbb] font-normal">({draft.clientLogos.length})</span></p>
                    <button className={b.sm} onClick={()=>setModal({k:'add-logo'})}><I.Plus/>Add Logo</button>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                    {draft.clientLogos.map((logo,i)=>(
                      <div key={`${logo}-${i}`} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden group hover:border-[#ddd] transition-all shadow-sm">
                        <div className="relative aspect-square bg-[#f9f9f9] flex items-center justify-center p-3">
                          {logo&&<img src={logo} alt="" className="w-full h-full object-contain"/>}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button className={b.iconLt} onClick={()=>moveLogo(i,-1)} disabled={i===0}><I.Up/></button>
                            <button className={b.iconLt} onClick={()=>moveLogo(i,1)} disabled={i===draft.clientLogos.length-1}><I.Down/></button>
                            <button className={b.iconLt} onClick={()=>setModal({k:'edit-logo',i})}><I.Edit/></button>
                            <button className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#dc2626] text-white cursor-pointer p-0 font-[inherit]" onClick={()=>setModal({k:'del',label:`Logo ${i+1}`,onConfirm:()=>delLogo(i)})}><I.Trash/></button>
                          </div>
                        </div>
                        <p className="text-[#ccc] text-[0.62rem] truncate px-2 py-1.5 font-mono">{logo.split('/').pop()}</p>
                      </div>
                    ))}
                    {!draft.clientLogos.length&&<p className="text-[#ccc] text-sm py-4 text-center col-span-full">No logos yet</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── TEAM ── */}
            {active==='team'&&(
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111] font-bold text-[0.92rem]">Team <span className="text-[#bbb] font-normal">({draft.team.length})</span></h3>
                  <button className={b.primary} onClick={()=>setModal({k:'add-tm'})}><I.Plus/>Add Member</button>
                </div>
                <SearchBar query={query} setQuery={setQuery} placeholder="Search by name or role…"/>
                {filteredTm.length===0&&(query?<p className="text-[#bbb] text-sm text-center py-10">No members match</p>:<Empty label="team member" onAdd={()=>setModal({k:'add-tm'})}/>)}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTm.map((m)=>{
                    const i=draft.team.indexOf(m);
                    return(
                      <div key={m.id} className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm text-center hover:border-[#ddd] hover:shadow-md transition-all">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f5f5f5] mx-auto mb-3">
                          {m.photo&&<img src={m.photo} alt="" className="w-full h-full object-cover" style={{objectPosition:m.position??'50% 20%'}}/>}
                        </div>
                        <p className="text-[#111] font-bold text-[0.85rem]">{m.name||'—'}</p>
                        <p className="text-[#888] text-[0.75rem] mb-4">{m.role||'—'}</p>
                        <div className="flex justify-center gap-1">
                          <button className={b.icon} onClick={()=>moveTm(i,-1)} disabled={i===0}><I.Up/></button>
                          <button className={b.icon} onClick={()=>moveTm(i,1)} disabled={i===draft.team.length-1}><I.Down/></button>
                          <button className={`${b.icon} !w-auto px-2 text-[0.72rem] font-semibold`} onClick={()=>setModal({k:'edit-tm',i})}><I.Edit/>Edit</button>
                          <button className={b.iconDng} onClick={()=>setModal({k:'del',label:m.name,onConfirm:()=>delTm(i)})}><I.Trash/></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ═══ MODALS ══════════════════════════════════════════════════ */}
      {modal?.k==='add-svc'&&<ServiceModal onSave={item=>{saveSvc(item);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-svc'&&<ServiceModal initial={draft.services[modal.i]} onSave={item=>{saveSvc(item,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-pf'&&<PortfolioModal services={draft.services} onSave={item=>{savePf(item);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-pf'&&<PortfolioModal initial={draft.portfolio[modal.i]} services={draft.services} onSave={item=>{savePf(item,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-slide'&&<SlideModal onSave={(img,note)=>{addSlide(img,note);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-slide'&&<SlideModal initial={{image:imgs()[modal.i],note:nts()[modal.i]??''}} onSave={(img,note)=>{editSlide(modal.i,img,note);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-gal'&&<GalleryModal onSave={url=>{saveGal(url);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-gal'&&<GalleryModal initial={draft.gallery[modal.i]} index={modal.i} onSave={url=>{saveGal(url,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-tm'&&<TeamModal onSave={item=>{saveTm(item);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-tm'&&<TeamModal initial={draft.team[modal.i]} onSave={item=>{saveTm(item,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-logo'&&<LogoModal onSave={url=>{saveLogo(url);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-logo'&&<LogoModal initial={draft.clientLogos[modal.i]} onSave={url=>{saveLogo(url,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='del'&&<ConfirmModal label={modal.label} onConfirm={modal.onConfirm} onClose={()=>setModal(null)}/>}
    </div>
  );
};

export default AdminDashboard;
