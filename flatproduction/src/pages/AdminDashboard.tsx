import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard, Film, Info, Briefcase, Layers,
  Image as ImageIcon, Star, Users,
  ChevronUp, ChevronDown, Trash2, Plus, Pencil,
  RotateCcw, Upload, LogOut,
  Search, Video, Check, X,
  List, LayoutGrid, ArrowUpRight,
  Link2, PlayCircle,
  Filter, Save, Zap,
  Home, Eye, MessageSquare, Globe, Phone,
} from 'lucide-react';
import {
  contentStore,
  type SiteContent,
  type Testimonial,
  type StatItem,
  type GalleryItem,
  DEFAULT_SITE_CONTENT,
  GALLERY_CATEGORIES,
  toOneSentence,
} from '../store/contentStore';
import { isAdminAuthed, broadcastLogout } from '../App';

/* ─── Types ─────────────────────────────────────────────────────── */
type SectionKey = 'overview'|'hero'|'about'|'services'|'portfolio'|'gallery'|'clients'|'team'|'testimonials'|'pages'|'contact';
type ServiceItem   = SiteContent['services'][number];
type PortfolioItem = SiteContent['portfolio'][number];
type TeamItem      = SiteContent['team'][number];
type ViewMode = 'grid'|'list';

const uid = () => `id-${Math.random().toString(36).slice(2,9)}`;

function resolveImageUrl(url: string): string {
  if (!url) return url;
  if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) return url;
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (fileMatch) return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1200`;
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1200`;
  return url;
}

function cloneContent(c: SiteContent): SiteContent {
  return {
    hero:         { ...c.hero, images:[...(c.hero.images??[])], notes:[...(c.hero.notes??[])] },
    about:        { ...c.about },
    testimonials: c.testimonials.map(t=>({...t})),
    services:     c.services.map(s=>({...s})),
    portfolio:    c.portfolio.map(p=>({...p})),
    clientsIntro: c.clientsIntro,
    clients:      [...c.clients],
    clientLogos:  [...c.clientLogos],
    team:         c.team.map(m=>({...m})),
    gallery:      c.gallery.map(g => ({ ...g })),
    contact:      { ...c.contact, socials: { ...c.contact.socials } },
    pageHeroes: {
      about:     { ...c.pageHeroes.about },
      services:  { ...c.pageHeroes.services },
      portfolio: { ...c.pageHeroes.portfolio },
      gallery:   { ...c.pageHeroes.gallery },
      contact:   { ...c.pageHeroes.contact },
    },
  };
}
function move<T>(arr:T[],from:number,to:number):T[]{
  if(to<0||to>=arr.length)return arr;
  const n=[...arr];const[x]=n.splice(from,1);n.splice(to,0,x);return n;
}


/* ─── Count-up hook ─────────────────────────────────────────────── */
function useCountUp(target: number, duration = 700): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let id: ReturnType<typeof requestAnimationFrame>;
    let start: number|null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

/* ─── Button palette ─────────────────────────────────────────────── */
const b = {
  primary: 'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#111] text-white text-sm font-bold cursor-pointer border-0 font-[inherit] transition-all duration-200 hover:bg-[#2a2a2a] active:scale-95',
  ghost:   'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#ddd] text-[#444] text-sm font-semibold cursor-pointer font-[inherit] transition-all duration-200 hover:border-[#111] hover:text-[#111] active:scale-95',
  danger:  'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#fca5a5] text-[#dc2626] text-sm font-semibold cursor-pointer font-[inherit] transition-all duration-200 hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] active:scale-95',
  sm:      'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#111] text-white text-sm font-bold cursor-pointer border-0 font-[inherit] transition-all duration-200 hover:bg-[#333] active:scale-95',
  smGhost: 'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#e5e5e5] text-[#555] text-sm font-semibold cursor-pointer font-[inherit] transition-all duration-200 hover:border-[#111] hover:text-[#111] active:scale-95',
  icon:    'inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#e5e5e5] bg-white text-[#666] cursor-pointer font-[inherit] transition-all duration-150 p-0 hover:border-[#111] hover:text-[#111] hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none',
  iconDng: 'inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#fca5a5] bg-white text-[#dc2626] cursor-pointer font-[inherit] transition-all duration-150 p-0 hover:bg-[#dc2626] hover:text-white hover:scale-110 disabled:opacity-30',
  iconLt:  'inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm text-[#111] cursor-pointer p-0 font-[inherit] shadow transition-all duration-150 hover:bg-white hover:scale-110 disabled:opacity-30 disabled:pointer-events-none',
  iconLtDng:'inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#dc2626] text-white cursor-pointer p-0 font-[inherit] shadow transition-all duration-150 hover:bg-[#b91c1c] hover:scale-110',
};

/* ─── ImageField ─────────────────────────────────────────────────── */
const ImageField: React.FC<{value:string;onChange:(v:string)=>void;label?:string}> =
  ({value,onChange,label='Image'})=>{
  const [tab,setTab]=useState<'url'|'upload'>('url');
  const ref=useRef<HTMLInputElement>(null);
  const isB64=value?.startsWith('data:');

  const handleFile=(file:File)=>{
    if(file.size>4*1024*1024){alert('Max 4 MB.');return;}
    const r=new FileReader();
    r.onload=e=>{if(e.target?.result)onChange(e.target.result as string);};
    r.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.7rem] font-bold text-[#111] uppercase tracking-[0.09em]">{label}</label>
      {value&&(
        <div className="relative rounded-xl overflow-hidden border border-[#e5e5e5] bg-[#f5f5f5] animate-scale-in" style={{aspectRatio:'16/7',maxHeight:108}}>
          <img src={resolveImageUrl(value)} alt="" className="w-full h-full object-cover"/>
          <button className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer border-0 font-[inherit]" onClick={()=>onChange('')}><X size={11}/></button>
        </div>
      )}
      <div className="flex rounded-xl overflow-hidden border border-[#e5e5e5] text-[0.72rem] font-bold">
        {(['url','upload'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-1.5 cursor-pointer border-0 font-[inherit] transition-all duration-200 flex items-center justify-center gap-1.5 ${tab===t?'bg-[#111] text-white':'bg-white text-[#aaa] hover:text-[#666]'}`}>
            {t==='url'?<Link2 size={11}/>:<Upload size={11}/>}
            {t==='url'?'URL':'Upload'}
          </button>
        ))}
      </div>
      {tab==='url'&&(
        <input type="text" value={isB64?'':(value??'')} onChange={e=>onChange(e.target.value)} placeholder="https://… or /photo.jpg"
          className="w-full py-2 px-3 border border-[#ddd] rounded-xl text-[0.82rem] text-[#111] outline-none font-[inherit] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all placeholder:text-[#bbb]"/>
      )}
      {tab==='upload'&&(
        <>
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e=>{if(e.target.files?.[0])handleFile(e.target.files[0]);e.target.value='';}}/>
          <div onDrop={e=>{e.preventDefault();if(e.dataTransfer.files[0])handleFile(e.dataTransfer.files[0]);}}
               onDragOver={e=>e.preventDefault()} onClick={()=>ref.current?.click()}
               className="border-2 border-dashed border-[#ddd] rounded-xl py-6 text-center cursor-pointer hover:border-[#111] hover:bg-[#fafafa] transition-all duration-200 group">
            <Upload size={18} className="mx-auto text-[#ccc] group-hover:text-[#111] transition-colors mb-1.5"/>
            <p className="text-[0.75rem] text-[#bbb] group-hover:text-[#888] transition-colors">
              {isB64?'Uploaded — click to replace':'Click or drag & drop (max 4 MB)'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Field ──────────────────────────────────────────────────────── */
const Field: React.FC<{label:string;children:React.ReactNode;className?:string}> = ({label,children,className=''})=>(
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-bold text-[#111] uppercase tracking-[0.08em]">{label}</label>
    {React.Children.map(children, child=>{
      if(!React.isValidElement(child))return child;
      const el=child as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
      return React.cloneElement(el,{className:[
        'w-full py-2.5 px-3.5 border border-[#ddd] rounded-xl text-sm text-[#111] bg-white outline-none font-[inherit] transition-all duration-200',
        'focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] placeholder:text-[#bbb]',
        el.type==='textarea'?'resize-y min-h-[72px] leading-relaxed':'',
        (el.props.className??'') as string,
      ].join(' ')});
    })}
  </div>
);

/* ─── ModalShell ─────────────────────────────────────────────────── */
const ModalShell: React.FC<{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}> =
  ({title,onClose,children,wide})=>{
  useEffect(()=>{
    document.body.style.overflow='hidden';
    const k=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',k);
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',k);};
  },[onClose]);
  return(
    <div className="fixed inset-0 z-[6000] bg-black/70 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className={`bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-h-[96vh] overflow-y-auto animate-slide-bottom sm:animate-scale-in ${wide?'sm:max-w-[700px]':'sm:max-w-[520px]'}`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] sticky top-0 bg-white/95 backdrop-blur-sm z-10 rounded-t-3xl sm:rounded-t-2xl">
          <h3 className="text-[#111] font-bold text-[0.95rem]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[#e5e5e5] flex items-center justify-center text-[#888] hover:text-[#111] hover:border-[#111] transition-all duration-150 cursor-pointer bg-transparent font-[inherit] hover:rotate-90"><X size={14}/></button>
        </div>
        <div className="p-6 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};

/* ─── Reset / Restore Confirm Modal ─────────────────────────────── */
const ResetModal: React.FC<{hasBackup:boolean;onConfirm:()=>void;onClose:()=>void}> = ({hasBackup,onConfirm,onClose})=>(
  <ModalShell title="Reset to Defaults" onClose={onClose}>
    <div className="text-center py-3 animate-pop-in">
      <div className="w-14 h-14 rounded-full bg-[#fff7ed] border-2 border-[#fed7aa] flex items-center justify-center mx-auto mb-4">
        <RotateCcw size={24} className="text-[#ea580c]"/>
      </div>
      <p className="text-[#111] font-semibold text-base mb-2">Reset all content to factory defaults?</p>
      <p className="text-[#666] text-sm leading-relaxed">
        Every text, image, and item you have customised will be replaced with the original defaults.
        {hasBackup
          ? ' A backup of your current content already exists and can be restored at any time.'
          : ' Your current content will be backed up so you can restore it afterwards.'}
      </p>
    </div>
    <div className="flex gap-2 justify-center">
      <button className={b.ghost} onClick={onClose}>Cancel</button>
      <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-bold transition-colors border-0 cursor-pointer font-[inherit]"
        onClick={()=>{onConfirm();onClose();}}>
        <RotateCcw size={13}/>Yes, Reset
      </button>
    </div>
  </ModalShell>
);

/* ─── Confirm Delete Modal ───────────────────────────────────────── */
const ConfirmModal: React.FC<{label:string;onConfirm:()=>void;onClose:()=>void}> = ({label,onConfirm,onClose})=>(
  <ModalShell title="Confirm Delete" onClose={onClose}>
    <div className="text-center py-3 animate-pop-in">
      <div className="w-16 h-16 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-4 border-2 border-[#fecaca]">
        <Trash2 size={24} className="text-[#dc2626]"/>
      </div>
      <p className="text-[#111] font-bold text-base mb-1.5">Delete "{label}"?</p>
      <p className="text-[#888] text-sm">This cannot be undone.</p>
    </div>
    <div className="flex gap-2 justify-center">
      <button className={b.ghost} onClick={onClose}>Cancel</button>
      <button className={b.danger} onClick={()=>{onConfirm();onClose();}}><Trash2 size={13}/>Yes, Delete</button>
    </div>
  </ModalShell>
);

/* ─── Service Modal ──────────────────────────────────────────────── */
const ServiceModal: React.FC<{initial?:ServiceItem;onSave:(item:ServiceItem)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [t,setT]=useState(initial?.title??'');
  const [d,setD]=useState(initial?.description??'');
  const [ext,setExt]=useState(initial?.extendedDescription??'');
  const [img,setImg]=useState(initial?.image??'');
  return(
    <ModalShell title={initial?'Edit Service':'Add Service'} wide onClose={onClose}>
      <ImageField value={img} onChange={setImg}/>
      <Field label="Title"><input value={t} onChange={e=>setT(e.target.value)} placeholder="Service name"/></Field>
      <Field label="Card Description (short — shown on service card)"><textarea rows={2} value={d} onChange={e=>setD(e.target.value)} placeholder="Brief one-line description shown on the card…"/></Field>
      <Field label="Popup Description (shown when visitor clicks Learn More)"><textarea rows={4} value={ext} onChange={e=>setExt(e.target.value)} placeholder="Detailed description shown in the popup modal…"/></Field>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(t.trim())onSave({id:initial?.id??uid(),title:t,description:d,image:img,extendedDescription:ext});}}><Save size={13}/>{initial?'Save Changes':'Add Service'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─── Portfolio Modal ────────────────────────────────────────────── */
const PORTFOLIO_CATS = ['Photography','Video Production','Live Streaming','Web & Digital','Graphics Design','Branding','Documentary','Event & Entertainment'];
const PortfolioModal: React.FC<{initial?:PortfolioItem;services:ServiceItem[];onSave:(item:PortfolioItem)=>void;onClose:()=>void}> =
  ({initial,services,onSave,onClose})=>{
  const [t,setT]=useState(initial?.title??'');
  const [d,setD]=useState(initial?.description??'');
  const [img,setImg]=useState(initial?.image??'');
  const [vid,setVid]=useState(initial?.videoUrl??'');
  const [bts,setBts]=useState(initial?.btsUrl??'');
  const [svc,setSvc]=useState(initial?.serviceId??'');
  const [cat,setCat]=useState(()=>{
    const c=initial?.category??'';
    return PORTFOLIO_CATS.includes(c)?c:'';
  });
  const [lnk,setLnk]=useState(initial?.link??'');
  return(
    <ModalShell title={initial?'Edit Project':'Add Project'} wide onClose={onClose}>
      <ImageField value={img} onChange={setImg} label="Cover / Thumbnail"/>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Project Title"><input value={t} onChange={e=>setT(e.target.value)} placeholder="Title"/></Field>
        <div className="flex flex-col gap-1">
          <label className="text-[0.7rem] font-bold text-[#111] uppercase tracking-[0.09em]">Category</label>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="w-full py-2 px-3 border border-[#ddd] rounded-xl text-[0.82rem] text-[#111] bg-white outline-none font-[inherit] focus:border-[#111] transition-all cursor-pointer">
            <option value="">— Select category —</option>
            {PORTFOLIO_CATS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Description"><textarea rows={2} value={d} onChange={e=>setD(e.target.value)} placeholder="One-line description…"/></Field>
        <div className="flex flex-col gap-1">
          <label className="text-[0.7rem] font-bold text-[#111] uppercase tracking-[0.09em]">Linked Service</label>
          <select value={svc} onChange={e=>setSvc(e.target.value)} className="w-full py-2 px-3 border border-[#ddd] rounded-xl text-[0.82rem] text-[#111] bg-white outline-none font-[inherit] focus:border-[#111] transition-all cursor-pointer">
            <option value="">— None —</option>
            {services.map(s=><option key={s.id} value={s.id}>{s.title.split(' ').slice(0,4).join(' ')}</option>)}
          </select>
        </div>
      </div>
      <Field label="Project Link (optional)"><input value={lnk} onChange={e=>setLnk(e.target.value)} placeholder="/portfolio or https://…"/></Field>
      <div className="border-t border-[#f5f5f5] pt-4">
        <p className="text-[0.7rem] font-bold text-[#aaa] uppercase tracking-[0.09em] mb-3 flex items-center gap-1.5"><Video size={12}/>Video Links</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Main Video (YouTube)"><input value={vid} onChange={e=>setVid(e.target.value)} placeholder="https://youtu.be/…"/></Field>
          <Field label="Behind-the-Scenes"><input value={bts} onChange={e=>setBts(e.target.value)} placeholder="https://youtu.be/…"/></Field>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(t.trim())onSave({id:initial?.id??uid(),title:t,description:toOneSentence(d),image:img,videoUrl:vid,btsUrl:bts,serviceId:svc,link:lnk||'#',category:cat||t});}}><Save size={13}/>{initial?'Save Changes':'Add Project'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─── Hero Slide Modal ───────────────────────────────────────────── */
const SlideModal: React.FC<{initial?:{image:string;note:string};onSave:(img:string,note:string)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [img,setImg]=useState(initial?.image??'');
  const [note,setNote]=useState(initial?.note??'');
  return(
    <ModalShell title={initial?'Edit Slide':'Add Hero Slide'} onClose={onClose}>
      <ImageField value={img} onChange={setImg} label="Slide Background"/>
      <Field label="Caption"><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Slide caption or note"/></Field>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(img.trim())onSave(img,note);}}><Save size={13}/>{initial?'Save Changes':'Add Slide'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─── Gallery Modal ──────────────────────────────────────────────── */
const GalleryModal: React.FC<{initial?:GalleryItem;onSave:(item:GalleryItem)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [url,setUrl]=useState(initial?.src??'');
  const [cat,setCat]=useState<string>(initial?.category??'Event Photography');
  return(
    <ModalShell title={initial?'Edit Image':'Add Gallery Image'} onClose={onClose}>
      <ImageField value={url} onChange={setUrl}/>
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.7rem] font-bold text-[#111] uppercase tracking-[0.09em]">Category</label>
        <select value={cat} onChange={e=>setCat(e.target.value)} className="w-full py-2.5 px-3.5 border border-[#ddd] rounded-xl text-sm text-[#111] bg-white outline-none font-[inherit] focus:border-[#111] transition-all cursor-pointer">
          {GALLERY_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(url.trim())onSave({src:url,category:cat});}}><Save size={13}/>{initial?'Save Changes':'Add Image'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─── Team Modal ─────────────────────────────────────────────────── */
const TeamModal: React.FC<{initial?:TeamItem;onSave:(item:TeamItem)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [name,setName]=useState(initial?.name??'');
  const [role,setRole]=useState(initial?.role??'');
  const [bio,setBio]=useState(initial?.bio??'');
  const [photo,setPhoto]=useState(initial?.photo??'');
  return(
    <ModalShell title={initial?'Edit Member':'Add Team Member'} onClose={onClose}>
      <ImageField value={photo} onChange={setPhoto} label="Photo"/>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/></Field>
        <Field label="Role / Title"><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role"/></Field>
      </div>
      <Field label="Short Bio"><textarea rows={2} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Brief bio…"/></Field>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(name.trim())onSave({id:initial?.id??uid(),name,role,bio,photo,position:initial?.position??'50% 20%'});}}><Save size={13}/>{initial?'Save Changes':'Add Member'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─── Logo Modal ─────────────────────────────────────────────────── */
const LogoModal: React.FC<{initial?:string;onSave:(url:string)=>void;onClose:()=>void}> = ({initial,onSave,onClose})=>{
  const [url,setUrl]=useState(initial??'');
  return(
    <ModalShell title={initial!==undefined?'Edit Logo':'Add Client Logo'} onClose={onClose}>
      <ImageField value={url} onChange={setUrl} label="Logo Image"/>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(url.trim())onSave(url);}}><Save size={13}/>{initial!==undefined?'Save Changes':'Add Logo'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─── Animated Stat Card ─────────────────────────────────────────── */
const StatCard: React.FC<{label:string;target:number;icon:React.ReactNode;onClick?:()=>void;delay?:number}> =
  ({label,target,icon,onClick,delay=0})=>{
  const count=useCountUp(target);
  return(
    <button onClick={onClick} className="bg-white border border-[#ebebeb] rounded-2xl p-5 text-left transition-all duration-300 hover:border-[#111] hover:shadow-lg hover:-translate-y-1 group cursor-pointer w-full animate-fade-in-up" style={{animationDelay:`${delay}ms`}}>
      <div className="flex items-start justify-between mb-3">
        <span className="w-9 h-9 rounded-xl bg-[#f5f5f5] flex items-center justify-center text-[#555] group-hover:bg-[#111] group-hover:text-white transition-all duration-300">{icon}</span>
        <ArrowUpRight size={14} className="text-[#ddd] group-hover:text-[#111] transition-colors duration-200"/>
      </div>
      <p className="text-[#111] font-bold text-4xl leading-none tabular-nums">{count}</p>
      <p className="text-[#888] text-sm mt-2 font-medium">{label}</p>
    </button>
  );
};

/* ─── Overview ───────────────────────────────────────────────────── */
const Overview: React.FC<{draft:SiteContent;go:(s:SectionKey)=>void;visits:number}> = ({draft,go,visits})=>{
  return(
    <div>
      {/* Welcome heading */}
      <div className="mb-7 animate-fade-in-up">
        <h2 className="text-[#111] font-bold text-3xl tracking-tight">Welcome back</h2>
        <p className="text-[#888] text-base mt-1">Manage your site content from here.</p>
      </div>

      {/* Stat tiles — 6 across two rows */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard target={draft.hero.images?.length??0} label="Hero Slides"    icon={<Film size={18}/>}      onClick={()=>go('hero')}         delay={0}/>
        <StatCard target={draft.services.length}         label="Services"       icon={<Briefcase size={18}/>} onClick={()=>go('services')}     delay={60}/>
        <StatCard target={draft.portfolio.length}        label="Projects"       icon={<Layers size={18}/>}    onClick={()=>go('portfolio')}    delay={120}/>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard target={draft.gallery.length}          label="Gallery Images" icon={<ImageIcon size={18}/>} onClick={()=>go('gallery')}      delay={180}/>
        <StatCard target={draft.team.length}             label="Team Members"   icon={<Users size={18}/>}     onClick={()=>go('team')}         delay={240}/>
        <StatCard target={draft.testimonials.length}     label="Testimonials"   icon={<MessageSquare size={18}/>} onClick={()=>go('testimonials')} delay={300}/>
      </div>

      {/* Quick actions + recent */}
      <div className="grid grid-cols-[1fr_300px] gap-5 animate-fade-in-up" style={{animationDelay:'340ms'}}>
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-sm">
          <p className="text-[#111] font-bold text-base mb-4 flex items-center gap-2"><Zap size={16}/>Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['services',  'Services',  <Briefcase size={14}/>],
              ['portfolio', 'Portfolio', <Layers size={14}/>],
              ['gallery',   'Gallery',   <ImageIcon size={14}/>],
              ['team',      'Team',      <Users size={14}/>],
              ['clients',   'Clients',   <Star size={14}/>],
              ['hero',      'Hero',      <Film size={14}/>],
              ['about',     'About',     <Info size={14}/>],
            ] as [SectionKey, string, React.ReactNode][]).map(([s,label,ico])=>(
              <button key={s} onClick={()=>go(s)}
                className="text-left px-4 py-3 rounded-xl border border-[#ebebeb] text-sm font-semibold text-[#444] hover:bg-[#111] hover:text-white hover:border-[#111] transition-all duration-200 cursor-pointer font-[inherit] flex items-center justify-between group">
                <span className="flex items-center gap-2.5">
                  <span className="text-[#bbb] group-hover:text-white/60 transition-colors">{ico}</span>
                  Manage {label}
                </span>
                <ArrowUpRight size={13} className="text-[#ddd] group-hover:text-white/40 transition-colors flex-shrink-0"/>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Recent portfolio */}
          {draft.portfolio.length>0&&(
            <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm">
              <p className="text-[#111] font-bold text-base mb-4">Recent Projects</p>
              <div className="flex flex-col gap-3">
                {draft.portfolio.slice(-4).reverse().map(p=>(
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                      {p.image&&<img src={p.image} alt="" className="w-full h-full object-cover"/>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#111] font-semibold truncate">{p.title}</p>
                      <p className="text-xs text-[#bbb] truncate">{p.videoUrl?'Video project':'Image project'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Recent team */}
          {draft.team.length>0&&(
            <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm">
              <p className="text-[#111] font-bold text-base mb-4">Team</p>
              <div className="flex flex-wrap gap-2">
                {draft.team.slice(0,6).map(m=>(
                  <div key={m.id} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f5f5f5]">
                      {m.photo&&<img src={m.photo} alt="" className="w-full h-full object-cover" style={{objectPosition:m.position??'50% 20%'}}/>}
                    </div>
                    <p className="text-[0.62rem] text-[#888] font-medium truncate max-w-[44px] text-center leading-tight">{m.name.split(' ')[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Section header ─────────────────────────────────────────────── */
const SectionHeader: React.FC<{title:string;count?:number;onAdd?:()=>void;addLabel?:string;view?:ViewMode;onView?:()=>void;children?:React.ReactNode}> =
  ({title,count,onAdd,addLabel='Add',view,onView,children})=>(
  <div className="flex items-center gap-2.5 mb-5 flex-wrap">
    <h3 className="text-[#111] font-bold text-xl flex items-center gap-2.5 mr-auto">
      {title}
      {count!==undefined&&<span className="bg-[#f0f0f0] text-[#777] text-xs font-bold px-2.5 py-1 rounded-full tabular-nums">{count}</span>}
    </h3>
    {children}
    {view&&onView&&(
      <button className={b.smGhost} onClick={onView}>
        {view==='grid'?<><List size={14}/>List view</>:<><LayoutGrid size={14}/>Grid view</>}
      </button>
    )}
    {onAdd&&<button className={b.primary} onClick={onAdd}><Plus size={14}/>{addLabel}</button>}
  </div>
);

/* ─── Search bar ─────────────────────────────────────────────────── */
const SearchBar: React.FC<{query:string;setQuery:(v:string)=>void;placeholder?:string;children?:React.ReactNode}> =
  ({query,setQuery,placeholder='Search…',children})=>(
  <div className="flex items-center gap-2.5 mb-5 flex-wrap">
    <div className="relative flex-1 min-w-[200px] max-w-sm">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none"/>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 border border-[#e5e5e5] rounded-xl text-sm text-[#111] bg-white outline-none font-[inherit] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.06)] transition-all placeholder:text-[#ccc]"/>
    </div>
    {children}
    {query&&<button onClick={()=>setQuery('')} className={b.smGhost}><X size={13}/>Clear</button>}
  </div>
);

/* ─── Empty state ────────────────────────────────────────────────── */
const Empty: React.FC<{label:string;onAdd:()=>void;icon?:React.ReactNode}> = ({label,onAdd,icon})=>(
  <div className="border-2 border-dashed border-[#e8e8e8] rounded-2xl py-16 text-center animate-fade-in-up">
    {icon&&<div className="flex justify-center mb-4 text-[#ddd]">{icon}</div>}
    <p className="text-[#bbb] text-base mb-5 font-medium">No {label} yet</p>
    <button className={b.primary} onClick={onAdd}><Plus size={15}/>Add {label}</button>
  </div>
);

/* ─── Toast ──────────────────────────────────────────────────────── */
const Toast: React.FC<{msg:string|null}> = ({msg})=>(
  <div className={`fixed bottom-7 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none transition-all duration-300 ${msg?'opacity-100 translate-y-0':'opacity-0 translate-y-3'}`}>
    <div className="bg-[#111] text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-2.5 whitespace-nowrap">
      <Check size={15}/>{msg}
    </div>
  </div>
);

/* ─── PageHeroCard ───────────────────────────────────────────────── */
const PAGE_LABELS: Record<string,string> = {
  about:'About Page', services:'Services Page', portfolio:'Portfolio Page',
  gallery:'Gallery Page', contact:'Contact Page',
};
const PageHeroCard: React.FC<{page:string;title:string;image:string;delay:number;onSave:(t:string,img:string)=>void}> =
  ({page,title:initTitle,image:initImage,delay,onSave})=>{
  const [t,setT]=useState(initTitle);
  const [img,setImg]=useState(initImage);
  const dirty=t!==initTitle||img!==initImage;
  return(
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{animationDelay:`${delay}ms`}}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#111] font-bold text-base flex items-center gap-2"><Globe size={14} className="text-[#bbb]"/>{PAGE_LABELS[page]||page}</p>
        {dirty&&<button className={b.sm} onClick={()=>onSave(t,img)}><Save size={13}/>Save</button>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <ImageField value={img} onChange={setImg} label="Hero Background Image"/>
        </div>
        <Field label="Hero Title / Headline">
          <textarea rows={4} value={t} onChange={e=>setT(e.target.value)} placeholder="Page headline…"/>
        </Field>
      </div>
      {img&&<div className="mt-4 rounded-xl overflow-hidden" style={{aspectRatio:'16/5',maxHeight:120}}>
        <img src={img} alt="" className="w-full h-full object-cover opacity-80"/>
      </div>}
    </div>
  );
};

/* ─── Testimonial Modal ──────────────────────────────────────────── */
const TestimonialModal: React.FC<{initial?:Testimonial;onSave:(item:Testimonial)=>void;onClose:()=>void}> =
  ({initial,onSave,onClose})=>{
  const [name,setName]=useState(initial?.name??'');
  const [quote,setQuote]=useState(initial?.quote??'');
  const [logo,setLogo]=useState(initial?.logoSrc??'');
  return(
    <ModalShell title={initial?'Edit Testimonial':'Add Testimonial'} onClose={onClose}>
      <ImageField value={logo} onChange={setLogo} label="Client Logo"/>
      <Field label="Company / Person Name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. MTN Rwanda"/></Field>
      <Field label="Quote"><textarea rows={3} value={quote} onChange={e=>setQuote(e.target.value)} placeholder="What they said…"/></Field>
      <div className="flex gap-2 pt-2">
        <button className={b.primary} onClick={()=>{if(name.trim())onSave({id:initial?.id??uid(),name,quote,logoSrc:logo});}}><Save size={13}/>{initial?'Save Changes':'Add Testimonial'}</button>
        <button className={b.ghost} onClick={onClose}>Cancel</button>
      </div>
    </ModalShell>
  );
};

/* ─── Modal type ─────────────────────────────────────────────────── */
type Modal =
  |null
  |{k:'add-svc'}|{k:'edit-svc';i:number}
  |{k:'add-pf'}|{k:'edit-pf';i:number}
  |{k:'add-slide'}|{k:'edit-slide';i:number}
  |{k:'add-gal'}|{k:'edit-gal';i:number}
  |{k:'add-tm'}|{k:'edit-tm';i:number}
  |{k:'add-logo'}|{k:'edit-logo';i:number}
  |{k:'add-tmt'}|{k:'edit-tmt';i:number}
  |{k:'del';label:string;onConfirm:()=>void}
  |{k:'reset'};

const NAV: [SectionKey, string, React.ReactNode, (d:SiteContent)=>number|null][] = [
  ['overview',     'Overview',     <LayoutDashboard size={15}/>, ()=>null],
  ['hero',         'Hero',         <Film size={15}/>,            d=>d.hero.images?.length??0],
  ['about',        'About',        <Info size={15}/>,            ()=>null],
  ['services',     'Services',     <Briefcase size={15}/>,       d=>d.services.length],
  ['portfolio',    'Portfolio',    <Layers size={15}/>,          d=>d.portfolio.length],
  ['gallery',      'Gallery',      <ImageIcon size={15}/>,       d=>d.gallery.length],
  ['clients',      'Clients',      <Star size={15}/>,            d=>d.clients.length+d.clientLogos.length],
  ['team',         'Team',         <Users size={15}/>,           d=>d.team.length],
  ['testimonials', 'Testimonials', <MessageSquare size={15}/>,   d=>d.testimonials.length],
  ['pages',        'Page Heroes',  <Globe size={15}/>,           ()=>null],
  ['contact',      'Contact',      <Phone size={15}/>,           ()=>null],
];

/* ─── MAIN ───────────────────────────────────────────────────────── */
const AdminDashboard: React.FC = ()=>{
  useEffect(()=>{
    if(!isAdminAuthed()){window.location.pathname='/login';}
  },[]);

  const [active,setActive] = useState<SectionKey>('overview');
  const [draft,setDraft]   = useState<SiteContent>(()=>cloneContent(contentStore.read()));
  const [modal,setModal]   = useState<Modal>(null);
  const [toast,setToast]   = useState<string|null>(null);
  const [query,setQuery]   = useState('');
  const [pfSvc,setPfSvc]   = useState('');
  const [pfType,setPfType] = useState('');
  const [views,setViews]     = useState<Record<string,ViewMode>>({services:'grid',portfolio:'list',team:'grid'});
  const [visits,setVisits]   = useState(()=>parseInt(localStorage.getItem('flat_visit_count')||'0',10));
  const [hasBackup,setHasBackup] = useState(()=>contentStore.hasBackup());

  useEffect(()=>{ return contentStore.onUpdate(c=>setDraft(cloneContent(c))); },[]);
  useEffect(()=>{ setQuery(''); setPfSvc(''); setPfType(''); },[active]);
  useEffect(()=>{
    const iv=setInterval(()=>setVisits(parseInt(localStorage.getItem('flat_visit_count')||'0',10)),5000);
    return()=>clearInterval(iv);
  },[]);

  const vm  = (s:string):ViewMode => views[s]??'grid';
  const tv  = (s:string) => setViews(v=>({...v,[s]:v[s]==='grid'?'list':'grid'}));

  const persist = (next:SiteContent, msg='Changes saved') => {
    const s=cloneContent(next);
    setDraft(s);
    contentStore.write(s);
    setToast(msg);
    setTimeout(()=>setToast(null),2200);
  };

  const resetToDefaults = () => {
    contentStore.saveBackup();
    setHasBackup(true);
    persist(cloneContent(DEFAULT_SITE_CONTENT), 'Content reset to defaults');
  };

  const restorePrevious = () => {
    const backup = contentStore.readBackup();
    if (!backup) return;
    persist(backup, 'Previous version restored');
  };

  const imgs = ()=>draft.hero.images??[];
  const nts  = ()=>draft.hero.notes??[];
  const setHero   = (f:'title'|'subtitle',v:string)=>persist({...draft,hero:{...draft.hero,[f]:v}});
  const addSlide  = (img:string,n:string)=>persist({...draft,hero:{...draft.hero,images:[...imgs(),img],notes:[...nts(),n]}},'Slide added');
  const editSlide = (i:number,img:string,n:string)=>persist({...draft,hero:{...draft.hero,images:imgs().map((x,j)=>j===i?img:x),notes:nts().map((x,j)=>j===i?n:x)}},'Slide saved');
  const moveSlide = (i:number,d:-1|1)=>persist({...draft,hero:{...draft.hero,images:move(imgs(),i,i+d),notes:move(nts(),i,i+d)}});
  const delSlide  = (i:number)=>persist({...draft,hero:{...draft.hero,images:imgs().filter((_,j)=>j!==i),notes:nts().filter((_,j)=>j!==i)}},'Slide deleted');

  const setAbout = (f:'heading'|'body',v:string)=>persist({...draft,about:{...draft.about,[f]:v}});

  const saveSvc = (item:ServiceItem,i?:number)=>persist({...draft,services:i===undefined?[...draft.services,item]:draft.services.map((s,j)=>j===i?item:s)},i===undefined?'Service added':'Service saved');
  const moveSvc = (i:number,d:-1|1)=>persist({...draft,services:move(draft.services,i,i+d)});
  const delSvc  = (i:number)=>persist({...draft,services:draft.services.filter((_,j)=>j!==i)},'Service deleted');

  const savePf = (item:PortfolioItem,i?:number)=>persist({...draft,portfolio:i===undefined?[...draft.portfolio,item]:draft.portfolio.map((p,j)=>j===i?item:p)},i===undefined?'Project added':'Project saved');
  const movePf = (i:number,d:-1|1)=>persist({...draft,portfolio:move(draft.portfolio,i,i+d)});
  const delPf  = (i:number)=>persist({...draft,portfolio:draft.portfolio.filter((_,j)=>j!==i)},'Project deleted');

  const saveGal = (item:GalleryItem,i?:number)=>persist({...draft,gallery:i===undefined?[...draft.gallery,item]:draft.gallery.map((x,j)=>j===i?item:x)},i===undefined?'Image added':'Image saved');
  const moveGal = (i:number,d:-1|1)=>persist({...draft,gallery:move(draft.gallery,i,i+d)});
  const delGal  = (i:number)=>persist({...draft,gallery:draft.gallery.filter((_,j)=>j!==i)},'Image deleted');

  const setIntro  = (v:string)=>persist({...draft,clientsIntro:v});
  const setClient = (i:number,v:string)=>persist({...draft,clients:draft.clients.map((x,j)=>j===i?v:x)});
  const addClient = ()=>persist({...draft,clients:[...draft.clients,'New Client']},'Client added');
  const delClient = (i:number)=>persist({...draft,clients:draft.clients.filter((_,j)=>j!==i)},'Client deleted');
  const saveLogo  = (url:string,i?:number)=>persist({...draft,clientLogos:i===undefined?[...draft.clientLogos,url]:draft.clientLogos.map((x,j)=>j===i?url:x)},i===undefined?'Logo added':'Logo saved');
  const moveLogo  = (i:number,d:-1|1)=>persist({...draft,clientLogos:move(draft.clientLogos,i,i+d)});
  const delLogo   = (i:number)=>persist({...draft,clientLogos:draft.clientLogos.filter((_,j)=>j!==i)},'Logo deleted');

  const saveTm = (item:TeamItem,i?:number)=>persist({...draft,team:i===undefined?[...draft.team,item]:draft.team.map((m,j)=>j===i?item:m)},i===undefined?'Member added':'Member saved');
  const moveTm = (i:number,d:-1|1)=>persist({...draft,team:move(draft.team,i,i+d)});
  const delTm  = (i:number)=>persist({...draft,team:draft.team.filter((_,j)=>j!==i)},'Member deleted');

  const saveTmt = (item:Testimonial,i?:number)=>persist({...draft,testimonials:i===undefined?[...draft.testimonials,item]:draft.testimonials.map((t,j)=>j===i?item:t)},i===undefined?'Testimonial added':'Testimonial saved');
  const moveTmt = (i:number,d:-1|1)=>persist({...draft,testimonials:move(draft.testimonials,i,i+d)});
  const delTmt  = (i:number)=>persist({...draft,testimonials:draft.testimonials.filter((_,j)=>j!==i)},'Testimonial deleted');

  const savePageHero=(page:keyof SiteContent['pageHeroes'],title:string,image:string)=>
    persist({...draft,pageHeroes:{...draft.pageHeroes,[page]:{title,image}}},'Hero saved');

  const q=query.toLowerCase();
  const filtSvc=draft.services.filter(s=>!q||s.title.toLowerCase().includes(q)||s.description.toLowerCase().includes(q));
  const filtPf=draft.portfolio.filter(p=>{
    if(q&&!p.title.toLowerCase().includes(q)&&!(p.description??'').toLowerCase().includes(q))return false;
    if(pfSvc&&p.serviceId!==pfSvc)return false;
    if(pfType==='video'&&!p.videoUrl)return false;
    if(pfType==='image'&&p.videoUrl)return false;
    return true;
  });
  const filtGal=draft.gallery.filter(g=>!q||g.src.toLowerCase().includes(q)||g.category.toLowerCase().includes(q));
  const filtTm=draft.team.filter(m=>!q||m.name.toLowerCase().includes(q)||m.role.toLowerCase().includes(q));

  return(
    <div className="flex h-screen overflow-hidden bg-white">

      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 bg-[#0a0a0a] flex flex-col h-screen">
        <div className="px-4 py-5 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10">
            <img src="/flat production.jpg.jpeg" alt="" className="w-full h-full object-cover"/>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Flat Admin</p>
            <p className="text-white/30 text-xs mt-0.5">Content Manager</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="text-white/20 text-[0.6rem] font-bold uppercase tracking-[0.15em] px-2 mb-3">Sections</p>
          {NAV.map(([key,label,icon,count])=>{
            const isA=active===key;
            const n=count(draft);
            return(
              <button key={key} onClick={()=>setActive(key)}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold cursor-pointer border-0 font-[inherit] transition-all duration-200 text-left mb-0.5 ${isA?'bg-white text-[#0a0a0a] shadow-lg':'bg-transparent text-white/40 hover:bg-white/[0.07] hover:text-white/80'}`}>
                <span className={`flex-shrink-0 transition-colors ${isA?'text-[#0a0a0a]':'text-white/25'}`}>{icon}</span>
                <span className="flex-1">{label}</span>
                {n!==null&&<span className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center ${isA?'bg-[#111] text-white':'bg-white/[0.08] text-white/30'}`}>{n}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.06] flex flex-col gap-2">
          <a href="/" className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-white/[0.07] text-white/60 text-sm font-semibold font-[inherit] transition-all duration-200 hover:bg-white/[0.12] hover:text-white no-underline">
            <Home size={14}/>View Website
          </a>
          <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-transparent border border-white/[0.07] text-white/40 cursor-pointer text-sm font-semibold font-[inherit] transition-all duration-200 hover:border-red-500/40 hover:text-red-400"
            onClick={()=>{broadcastLogout();window.location.pathname='/login';}}>
            <LogOut size={14}/>Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f7f7f7]">
        <header className="bg-white border-b border-[#ebebeb] px-6 h-[62px] flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <h2 className="text-[#111] font-bold text-lg">{NAV.find(n=>n[0]===active)?.[1]}</h2>
            <p className="text-[#ccc] text-xs leading-none mt-0.5">Admin › {active}</p>
          </div>
          <div className="flex items-center gap-2">
            {hasBackup && (
              <button className={b.smGhost} onClick={restorePrevious} title="Restore your content from before the last reset">
                <RotateCcw size={14}/>Restore Previous
              </button>
            )}
            <button className={b.smGhost} onClick={()=>setModal({k:'reset'})}><RotateCcw size={14}/>Reset Content</button>
          </div>
        </header>

        {/* key forces remount → triggers animation on section change */}
        <div key={active} className="flex-1 overflow-y-auto p-6 animate-fade-in-up">
          <div>

            {active==='overview'&&<Overview draft={draft} go={setActive} visits={visits}/>}

            {/* ── HERO ─────────────────────────────────────────── */}
            {active==='hero'&&(
              <div>
                <SectionHeader title="Hero Slides" count={imgs().length} onAdd={()=>setModal({k:'add-slide'})} addLabel="Add Slide"/>
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm mb-5 animate-fade-in-up">
                  <p className="text-[0.7rem] font-bold text-[#aaa] uppercase tracking-[0.09em] mb-3 flex items-center gap-1.5"><Info size={11}/>Page Text</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Headline"><input value={draft.hero.title} onChange={e=>setHero('title',e.target.value)} placeholder="Main headline"/></Field>
                    <Field label="Subtitle"><textarea rows={2} value={draft.hero.subtitle} onChange={e=>setHero('subtitle',e.target.value)} placeholder="Subtitle…"/></Field>
                  </div>
                </div>
                {imgs().length===0&&<Empty label="slide" onAdd={()=>setModal({k:'add-slide'})} icon={<Film size={36}/>}/>}
                <div className="flex flex-col gap-2">
                  {imgs().map((img,i)=>(
                    <div key={`${img}-${i}`} className="bg-white border border-[#ebebeb] rounded-2xl flex items-center gap-4 p-3 shadow-sm hover:border-[#ccc] hover:shadow-md transition-all duration-200 animate-fade-in-up group" style={{animationDelay:`${i*40}ms`}}>
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                        {img&&<img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#111] font-bold text-sm">Slide {i+1}</p>
                        <p className="text-[#aaa] text-sm truncate mt-0.5">{nts()[i]||<em>No caption</em>}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <button className={b.icon} onClick={()=>moveSlide(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                        <button className={b.icon} onClick={()=>moveSlide(i,1)} disabled={i===imgs().length-1}><ChevronDown size={13}/></button>
                        <button className={`${b.icon} !w-auto px-2.5 text-xs font-semibold`} onClick={()=>setModal({k:'edit-slide',i})}><Pencil size={12}/>Edit</button>
                        <button className={b.iconDng} onClick={()=>setModal({k:'del',label:`Slide ${i+1}`,onConfirm:()=>delSlide(i)})}><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ABOUT ────────────────────────────────────────── */}
            {active==='about'&&(
              <div className="flex flex-col gap-5">
                <SectionHeader title="About Section"/>

                {/* History block */}
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-scale-in">
                  <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] mb-4 flex items-center gap-1.5"><Info size={11}/>History & Heading</p>
                  <div className="flex flex-col gap-4">
                    <Field label="Section Heading"><input value={draft.about.heading} onChange={e=>setAbout('heading',e.target.value)} placeholder="Where Light Becomes Memory"/></Field>
                    <Field label="History Text"><textarea rows={5} value={draft.about.history??''} onChange={e=>persist({...draft,about:{...draft.about,history:e.target.value}})}/></Field>
                  </div>
                </div>

                {/* 4-image mosaic */}
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{animationDelay:'40ms'}}>
                  <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] mb-4 flex items-center gap-1.5"><ImageIcon size={11}/>Photo Mosaic (4 images)</p>
                  <div className="grid grid-cols-2 gap-4">
                    {(['image1','image2','image3','image4'] as const).map((key,i)=>(
                      <ImageField key={key} label={`Image ${i+1}`} value={draft.about[key]??''} onChange={v=>persist({...draft,about:{...draft.about,[key]:v}})}/>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{animationDelay:'60ms'}}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] flex items-center gap-1.5"><Zap size={11}/>Stats (shown on homepage)</p>
                    <button className={b.sm} onClick={() => {
                      const stats = [...(draft.about.stats ?? DEFAULT_SITE_CONTENT.about.stats!), { value: '0+', label: 'New Stat' }];
                      persist({ ...draft, about: { ...draft.about, stats } }, 'Stat added');
                    }}><Plus size={12}/>Add Stat</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(draft.about.stats ?? DEFAULT_SITE_CONTENT.about.stats!).map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#f9f9f9] border border-[#ebebeb] rounded-xl px-4 py-2.5 group">
                        <span className="text-[0.65rem] font-bold text-[#ddd] w-5 flex-shrink-0 tabular-nums">{i + 1}</span>
                        <input
                          value={stat.value}
                          onChange={e => {
                            const next: StatItem[] = (draft.about.stats ?? DEFAULT_SITE_CONTENT.about.stats!).map((s, j) => j === i ? { ...s, value: e.target.value } : s);
                            persist({ ...draft, about: { ...draft.about, stats: next } });
                          }}
                          placeholder="e.g. 8+"
                          className="w-20 bg-white border border-[#ddd] rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#111] outline-none font-[inherit] focus:border-[#111] transition-all"
                        />
                        <input
                          value={stat.label}
                          onChange={e => {
                            const next: StatItem[] = (draft.about.stats ?? DEFAULT_SITE_CONTENT.about.stats!).map((s, j) => j === i ? { ...s, label: e.target.value } : s);
                            persist({ ...draft, about: { ...draft.about, stats: next } });
                          }}
                          placeholder="e.g. Years Active"
                          className="flex-1 bg-white border border-[#ddd] rounded-lg px-2.5 py-1.5 text-sm text-[#111] outline-none font-[inherit] focus:border-[#111] transition-all"
                        />
                        <button className={`${b.iconDng} opacity-0 group-hover:opacity-100 transition-opacity`}
                          onClick={() => setModal({ k: 'del', label: stat.label || `Stat ${i + 1}`, onConfirm: () => {
                            const stats = (draft.about.stats ?? DEFAULT_SITE_CONTENT.about.stats!).filter((_, j) => j !== i);
                            persist({ ...draft, about: { ...draft.about, stats } }, 'Stat deleted');
                          }})}>
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Chips */}
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{animationDelay:'70ms'}}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] flex items-center gap-1.5"><Layers size={11}/>Service Chips (shown on homepage)</p>
                    <button className={b.sm} onClick={() => {
                      const chips = [...(draft.about.chips ?? DEFAULT_SITE_CONTENT.about.chips!), 'New Tag'];
                      persist({ ...draft, about: { ...draft.about, chips } });
                    }}><Plus size={12}/>Add Chip</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(draft.about.chips ?? DEFAULT_SITE_CONTENT.about.chips!).map((chip, i) => {
                      const chips = draft.about.chips ?? DEFAULT_SITE_CONTENT.about.chips!;
                      return (
                        <div key={i} className="flex items-center gap-3 bg-[#f9f9f9] border border-[#ebebeb] rounded-xl px-4 py-2.5 group">
                          <span className="text-[0.65rem] font-bold text-[#ddd] w-5 flex-shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                          <input
                            value={chip}
                            onChange={e => {
                              const next = chips.map((c, j) => j === i ? e.target.value : c);
                              persist({ ...draft, about: { ...draft.about, chips: next } });
                            }}
                            className="flex-1 bg-transparent text-sm text-[#111] outline-none font-[inherit] border-0 font-medium"
                          />
                          <button className={`${b.iconDng} opacity-0 group-hover:opacity-100 transition-opacity`}
                            onClick={() => setModal({ k: 'del', label: chip, onConfirm: () => persist({ ...draft, about: { ...draft.about, chips: chips.filter((_, j) => j !== i) } }, 'Chip deleted') })}>
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      );
                    })}
                    {!(draft.about.chips ?? DEFAULT_SITE_CONTENT.about.chips!).length && (
                      <p className="text-[#ccc] text-sm py-4 text-center">No chips — add one</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                    <p className="text-xs text-[#bbb] mb-2">Preview:</p>
                    <div className="flex flex-wrap gap-2">
                      {(draft.about.chips ?? DEFAULT_SITE_CONTENT.about.chips!).map(tag => (
                        <span key={tag} className="border border-[#e5e5e5] bg-[#f5f5f5] text-[#666] text-[0.7rem] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mission / Vision / Value */}
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{animationDelay:'80ms'}}>
                  <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] mb-4 flex items-center gap-1.5"><Star size={11}/>Mission · Vision · Value</p>
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Our Mission"><textarea rows={3} value={draft.about.mission??''} onChange={e=>persist({...draft,about:{...draft.about,mission:e.target.value}})}/></Field>
                    <Field label="Our Vision"><textarea rows={3} value={draft.about.vision??''} onChange={e=>persist({...draft,about:{...draft.about,vision:e.target.value}})}/></Field>
                    <Field label="Our Value"><textarea rows={3} value={draft.about.value??''} onChange={e=>persist({...draft,about:{...draft.about,value:e.target.value}})}/></Field>
                  </div>
                </div>
              </div>
            )}

            {/* ── SERVICES ─────────────────────────────────────── */}
            {active==='services'&&(
              <div>
                <SectionHeader title="Services" count={draft.services.length} onAdd={()=>setModal({k:'add-svc'})} addLabel="Add Service" view={vm('services')} onView={()=>tv('services')}/>
                <SearchBar query={query} setQuery={setQuery} placeholder="Search services…"/>
                {filtSvc.length===0&&(query
                  ?<p className="text-[#bbb] text-sm text-center py-10">No services match "{query}"</p>
                  :<Empty label="service" onAdd={()=>setModal({k:'add-svc'})} icon={<Briefcase size={36}/>}/>
                )}
                {vm('services')==='grid'&&filtSvc.length>0&&(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtSvc.map(svc=>{
                      const i=draft.services.indexOf(svc);
                      return(
                        <div key={svc.id} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm hover:border-[#ccc] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up" style={{animationDelay:`${i*50}ms`}}>
                          <div className="aspect-[4/3] bg-[#f5f5f5] overflow-hidden">
                            {svc.image?<img src={svc.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>:<div className="w-full h-full flex items-center justify-center"><Briefcase size={32} className="text-[#ddd]"/></div>}
                          </div>
                          <div className="p-4">
                            <p className="text-[#111] font-bold text-sm mb-1.5 leading-tight">{svc.title}</p>
                            <p className="text-[#888] text-sm line-clamp-2 leading-relaxed mb-4">{svc.description}</p>
                            <div className="flex gap-1">
                              <button className={b.icon} onClick={()=>moveSvc(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                              <button className={b.icon} onClick={()=>moveSvc(i,1)} disabled={i===draft.services.length-1}><ChevronDown size={13}/></button>
                              <button className={`${b.icon} flex-1 !w-auto px-2 text-xs font-semibold`} onClick={()=>setModal({k:'edit-svc',i})}><Pencil size={12}/>Edit</button>
                              <button className={b.iconDng} onClick={()=>setModal({k:'del',label:svc.title,onConfirm:()=>delSvc(i)})}><Trash2 size={12}/></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {vm('services')==='list'&&filtSvc.length>0&&(
                  <div className="flex flex-col gap-2">
                    {filtSvc.map(svc=>{
                      const i=draft.services.indexOf(svc);
                      return(
                        <div key={svc.id} className="bg-white border border-[#ebebeb] rounded-2xl flex items-center gap-4 p-3.5 shadow-sm hover:border-[#ccc] hover:shadow-md transition-all duration-200 group animate-fade-in-up" style={{animationDelay:`${i*35}ms`}}>
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                            {svc.image?<img src={svc.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>:<Briefcase size={20} className="text-[#ddd] m-auto mt-4"/>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#111] font-bold text-sm">{svc.title}</p>
                            <p className="text-[#aaa] text-sm truncate">{svc.description}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button className={b.icon} onClick={()=>moveSvc(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                            <button className={b.icon} onClick={()=>moveSvc(i,1)} disabled={i===draft.services.length-1}><ChevronDown size={13}/></button>
                            <button className={`${b.icon} !w-auto px-2.5 text-xs font-semibold`} onClick={()=>setModal({k:'edit-svc',i})}><Pencil size={12}/>Edit</button>
                            <button className={b.iconDng} onClick={()=>setModal({k:'del',label:svc.title,onConfirm:()=>delSvc(i)})}><Trash2 size={12}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── PORTFOLIO ────────────────────────────────────── */}
            {active==='portfolio'&&(
              <div>
                <SectionHeader title="Portfolio" count={draft.portfolio.length} onAdd={()=>setModal({k:'add-pf'})} addLabel="Add Project" view={vm('portfolio')} onView={()=>tv('portfolio')}/>
                <SearchBar query={query} setQuery={setQuery} placeholder="Search projects…">
                  <div className="flex items-center gap-1.5">
                    <Filter size={13} className="text-[#bbb]"/>
                    <select value={pfSvc} onChange={e=>setPfSvc(e.target.value)} className="py-2 px-3 border border-[#e5e5e5] rounded-xl text-[0.78rem] text-[#555] bg-white outline-none font-[inherit] focus:border-[#111] cursor-pointer">
                      <option value="">All services</option>
                      {draft.services.map(s=><option key={s.id} value={s.id}>{s.title.split(' ').slice(0,3).join(' ')}</option>)}
                    </select>
                    <select value={pfType} onChange={e=>setPfType(e.target.value)} className="py-2 px-3 border border-[#e5e5e5] rounded-xl text-[0.78rem] text-[#555] bg-white outline-none font-[inherit] focus:border-[#111] cursor-pointer">
                      <option value="">All types</option>
                      <option value="video">Video only</option>
                      <option value="image">Image only</option>
                    </select>
                  </div>
                </SearchBar>
                {filtPf.length===0&&(query||pfSvc||pfType
                  ?<p className="text-[#bbb] text-sm text-center py-10">No projects match filters</p>
                  :<Empty label="project" onAdd={()=>setModal({k:'add-pf'})} icon={<Layers size={36}/>}/>
                )}
                {vm('portfolio')==='grid'&&filtPf.length>0&&(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtPf.map(pf=>{
                      const i=draft.portfolio.indexOf(pf);
                      const linkedSvc=draft.services.find(s=>s.id===pf.serviceId);
                      return(
                        <div key={pf.id} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm hover:border-[#ccc] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up" style={{animationDelay:`${i*50}ms`}}>
                          <div className="aspect-video bg-[#f5f5f5] overflow-hidden relative">
                            {pf.image?<img src={pf.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>:<div className="w-full h-full flex items-center justify-center"><Layers size={28} className="text-[#ddd]"/></div>}
                            {pf.videoUrl&&<div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white text-[0.6rem] font-bold px-2 py-1 rounded-full backdrop-blur-sm"><PlayCircle size={10}/>Video</div>}
                            {linkedSvc&&<div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 text-[#111] text-[0.6rem] font-bold px-2 py-1 rounded-full backdrop-blur-sm"><Link2 size={9}/>{linkedSvc.title.split(' ')[0]}</div>}
                          </div>
                          <div className="p-3.5">
                            <p className="text-[#111] font-bold text-sm mb-1">{pf.title}</p>
                            <p className="text-[#aaa] text-sm line-clamp-1 mb-3">{pf.description||'—'}</p>
                            <div className="flex gap-1">
                              <button className={b.icon} onClick={()=>movePf(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                              <button className={b.icon} onClick={()=>movePf(i,1)} disabled={i===draft.portfolio.length-1}><ChevronDown size={13}/></button>
                              <button className={`${b.icon} flex-1 !w-auto px-2 text-xs font-semibold`} onClick={()=>setModal({k:'edit-pf',i})}><Pencil size={12}/>Edit</button>
                              <button className={b.iconDng} onClick={()=>setModal({k:'del',label:pf.title,onConfirm:()=>delPf(i)})}><Trash2 size={12}/></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {vm('portfolio')==='list'&&filtPf.length>0&&(
                  <div className="flex flex-col gap-2">
                    {filtPf.map(pf=>{
                      const i=draft.portfolio.indexOf(pf);
                      const linkedSvc=draft.services.find(s=>s.id===pf.serviceId);
                      return(
                        <div key={pf.id} className="bg-white border border-[#ebebeb] rounded-2xl flex items-center gap-4 p-3.5 shadow-sm hover:border-[#ccc] hover:shadow-md transition-all duration-200 group animate-fade-in-up" style={{animationDelay:`${i*35}ms`}}>
                          <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0 relative">
                            {pf.image&&<img src={pf.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>}
                            {pf.videoUrl&&<div className="absolute inset-0 flex items-center justify-center"><PlayCircle size={20} className="text-white drop-shadow-lg"/></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <p className="text-[#111] font-bold text-sm">{pf.title}</p>
                              {pf.videoUrl&&<span className="flex items-center gap-0.5 bg-[#111] text-white text-xs font-bold px-1.5 py-0.5 rounded-full"><Video size={9}/>Video</span>}
                              {linkedSvc&&<span className="flex items-center gap-0.5 bg-[#f5f5f5] text-[#666] text-xs font-bold px-2 py-0.5 rounded-full"><Link2 size={9}/>{linkedSvc.title.split(' ')[0]}</span>}
                            </div>
                            <p className="text-[#aaa] text-sm truncate">{pf.description||'—'}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button className={b.icon} onClick={()=>movePf(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                            <button className={b.icon} onClick={()=>movePf(i,1)} disabled={i===draft.portfolio.length-1}><ChevronDown size={13}/></button>
                            <button className={`${b.icon} !w-auto px-2.5 text-xs font-semibold`} onClick={()=>setModal({k:'edit-pf',i})}><Pencil size={12}/>Edit</button>
                            <button className={b.iconDng} onClick={()=>setModal({k:'del',label:pf.title,onConfirm:()=>delPf(i)})}><Trash2 size={12}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── GALLERY ──────────────────────────────────────── */}
            {active==='gallery'&&(
              <div>
                <SectionHeader title="Gallery" count={draft.gallery.length} onAdd={()=>setModal({k:'add-gal'})} addLabel="Add Image"/>
                <SearchBar query={query} setQuery={setQuery} placeholder="Filter by filename…"/>
                {filtGal.length===0&&(query
                  ?<p className="text-[#bbb] text-sm text-center py-10">No images match</p>
                  :<Empty label="gallery image" onAdd={()=>setModal({k:'add-gal'})} icon={<ImageIcon size={36}/>}/>
                )}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                  {filtGal.map(g=>{
                    const i=draft.gallery.indexOf(g);
                    return(
                      <div key={`${g.src}-${i}`} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden group hover:border-[#ccc] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up" style={{animationDelay:`${i*25}ms`}}>
                        <div className="relative aspect-square bg-[#f5f5f5]">
                          <img src={g.src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"/>
                          <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5">
                            <button className={b.iconLt} onClick={()=>moveGal(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                            <button className={b.iconLt} onClick={()=>moveGal(i,1)} disabled={i===draft.gallery.length-1}><ChevronDown size={13}/></button>
                            <button className={b.iconLt} onClick={()=>setModal({k:'edit-gal',i})}><Pencil size={13}/></button>
                            <button className={b.iconLtDng} onClick={()=>setModal({k:'del',label:`Image ${i+1}`,onConfirm:()=>delGal(i)})}><Trash2 size={13}/></button>
                          </div>
                          <div className="absolute top-1.5 left-1.5 bg-black/40 text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">#{i+1}</div>
                        </div>
                        <div className="px-2 py-1.5">
                          <p className="text-[#888] text-[0.6rem] font-bold uppercase tracking-wide truncate group-hover:text-[#111] transition-colors">{g.category}</p>
                          <p className="text-[#ccc] text-[0.6rem] truncate font-mono group-hover:text-[#888] transition-colors">{g.src.split('/').pop()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CLIENTS ──────────────────────────────────────── */}
            {active==='clients'&&(
              <div className="flex flex-col gap-5">
                <SectionHeader title="Clients"/>
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-scale-in">
                  <p className="text-[0.7rem] font-bold text-[#aaa] uppercase tracking-[0.09em] mb-3 flex items-center gap-1.5"><Info size={11}/>Intro Text</p>
                  <Field label="Introduction"><textarea rows={3} value={draft.clientsIntro} onChange={e=>setIntro(e.target.value)}/></Field>
                </div>
                <div className="animate-fade-in-up" style={{animationDelay:'60ms'}}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#111] font-bold text-base flex items-center gap-2">Client Tags<span className="bg-[#f0f0f0] text-[#888] text-xs font-bold px-2 py-0.5 rounded-full">{draft.clients.length}</span></p>
                    <button className={b.sm} onClick={addClient}><Plus size={12}/>Add Tag</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {draft.clients.map((c,i)=>(
                      <div key={i} className="flex items-center gap-3 bg-white border border-[#ebebeb] rounded-xl px-4 py-2.5 shadow-sm hover:border-[#ccc] transition-all duration-200 group animate-fade-in-up" style={{animationDelay:`${i*30}ms`}}>
                        <span className="text-[0.65rem] font-bold text-[#ddd] w-5 flex-shrink-0 tabular-nums">{String(i+1).padStart(2,'0')}</span>
                        <input value={c} onChange={e=>setClient(i,e.target.value)} className="flex-1 bg-transparent text-sm text-[#111] outline-none font-[inherit] border-0 font-medium"/>
                        <button className={`${b.iconDng} opacity-0 group-hover:opacity-100 transition-opacity`} onClick={()=>setModal({k:'del',label:c,onConfirm:()=>delClient(i)})}><Trash2 size={12}/></button>
                      </div>
                    ))}
                    {!draft.clients.length&&<p className="text-[#ccc] text-sm py-6 text-center">No client tags — add one</p>}
                  </div>
                </div>
                <div className="animate-fade-in-up" style={{animationDelay:'120ms'}}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#111] font-bold text-base flex items-center gap-2">Client Logos<span className="bg-[#f0f0f0] text-[#888] text-xs font-bold px-2 py-0.5 rounded-full">{draft.clientLogos.length}</span></p>
                    <button className={b.sm} onClick={()=>setModal({k:'add-logo'})}><Plus size={12}/>Add Logo</button>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                    {draft.clientLogos.map((logo,i)=>(
                      <div key={`${logo}-${i}`} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden group hover:border-[#ccc] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up" style={{animationDelay:`${i*35}ms`}}>
                        <div className="relative aspect-square bg-[#f9f9f9] flex items-center justify-center p-4">
                          {logo&&<img src={logo} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"/>}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5">
                            <button className={b.iconLt} onClick={()=>moveLogo(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                            <button className={b.iconLt} onClick={()=>moveLogo(i,1)} disabled={i===draft.clientLogos.length-1}><ChevronDown size={13}/></button>
                            <button className={b.iconLt} onClick={()=>setModal({k:'edit-logo',i})}><Pencil size={13}/></button>
                            <button className={b.iconLtDng} onClick={()=>setModal({k:'del',label:`Logo ${i+1}`,onConfirm:()=>delLogo(i)})}><Trash2 size={13}/></button>
                          </div>
                        </div>
                        <p className="text-[#ccc] text-[0.62rem] truncate px-2 py-1.5 font-mono group-hover:text-[#888] transition-colors">{logo.split('/').pop()}</p>
                      </div>
                    ))}
                    {!draft.clientLogos.length&&<p className="text-[#ccc] text-sm py-6 text-center col-span-full">No logos yet</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── TEAM ─────────────────────────────────────────── */}
            {active==='team'&&(
              <div>
                <SectionHeader title="Team" count={draft.team.length} onAdd={()=>setModal({k:'add-tm'})} addLabel="Add Member" view={vm('team')} onView={()=>tv('team')}/>
                <SearchBar query={query} setQuery={setQuery} placeholder="Search by name or role…"/>
                {filtTm.length===0&&(query
                  ?<p className="text-[#bbb] text-sm text-center py-10">No members match</p>
                  :<Empty label="team member" onAdd={()=>setModal({k:'add-tm'})} icon={<Users size={36}/>}/>
                )}
                {vm('team')==='grid'&&filtTm.length>0&&(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtTm.map(m=>{
                      const i=draft.team.indexOf(m);
                      return(
                        <div key={m.id} className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm text-center hover:border-[#ccc] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up" style={{animationDelay:`${i*60}ms`}}>
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f5f5f5] mx-auto mb-3 ring-2 ring-transparent group-hover:ring-[#111] transition-all duration-300">
                            {m.photo&&<img src={m.photo} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" style={{objectPosition:m.position??'50% 20%'}}/>}
                          </div>
                          <p className="text-[#111] font-bold text-sm mb-0.5">{m.name||'—'}</p>
                          <p className="text-[#888] text-sm mb-1">{m.role||'—'}</p>
                          {m.bio&&<p className="text-[#bbb] text-xs leading-relaxed line-clamp-2 mb-4">{m.bio}</p>}
                          <div className="flex justify-center gap-1 mt-3">
                            <button className={b.icon} onClick={()=>moveTm(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                            <button className={b.icon} onClick={()=>moveTm(i,1)} disabled={i===draft.team.length-1}><ChevronDown size={13}/></button>
                            <button className={`${b.icon} !w-auto px-2.5 text-xs font-semibold`} onClick={()=>setModal({k:'edit-tm',i})}><Pencil size={12}/>Edit</button>
                            <button className={b.iconDng} onClick={()=>setModal({k:'del',label:m.name,onConfirm:()=>delTm(i)})}><Trash2 size={12}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {vm('team')==='list'&&filtTm.length>0&&(
                  <div className="flex flex-col gap-2">
                    {filtTm.map(m=>{
                      const i=draft.team.indexOf(m);
                      return(
                        <div key={m.id} className="bg-white border border-[#ebebeb] rounded-2xl flex items-center gap-4 p-3.5 shadow-sm hover:border-[#ccc] hover:shadow-md transition-all duration-200 group animate-fade-in-up" style={{animationDelay:`${i*35}ms`}}>
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                            {m.photo&&<img src={m.photo} alt="" className="w-full h-full object-cover" style={{objectPosition:m.position??'50% 20%'}}/>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#111] font-bold text-sm">{m.name||'—'}</p>
                            <p className="text-[#888] text-sm">{m.role||'—'}</p>
                            {m.bio&&<p className="text-[#bbb] text-xs truncate mt-0.5">{m.bio}</p>}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button className={b.icon} onClick={()=>moveTm(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                            <button className={b.icon} onClick={()=>moveTm(i,1)} disabled={i===draft.team.length-1}><ChevronDown size={13}/></button>
                            <button className={`${b.icon} !w-auto px-2.5 text-xs font-semibold`} onClick={()=>setModal({k:'edit-tm',i})}><Pencil size={12}/>Edit</button>
                            <button className={b.iconDng} onClick={()=>setModal({k:'del',label:m.name,onConfirm:()=>delTm(i)})}><Trash2 size={12}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── TESTIMONIALS ─────────────────────────────────── */}
            {active==='testimonials'&&(
              <div>
                <SectionHeader title="Testimonials" count={draft.testimonials.length} onAdd={()=>setModal({k:'add-tmt'})} addLabel="Add Testimonial"/>
                {draft.testimonials.length===0&&<Empty label="testimonial" onAdd={()=>setModal({k:'add-tmt'})} icon={<MessageSquare size={36}/>}/>}
                <div className="flex flex-col gap-2">
                  {draft.testimonials.map((t,i)=>(
                    <div key={t.id} className="bg-white border border-[#ebebeb] rounded-2xl flex items-start gap-4 p-4 shadow-sm hover:border-[#ccc] transition-all group animate-fade-in-up" style={{animationDelay:`${i*40}ms`}}>
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f5f5f5] flex-shrink-0 border border-[#ebebeb]">
                        {t.logoSrc&&<img src={t.logoSrc} alt="" className="w-full h-full object-contain p-1"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#111] font-bold text-sm">{t.name}</p>
                        <p className="text-[#888] text-sm mt-1 line-clamp-2 italic">"{t.quote}"</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className={b.icon} onClick={()=>moveTmt(i,-1)} disabled={i===0}><ChevronUp size={13}/></button>
                        <button className={b.icon} onClick={()=>moveTmt(i,1)} disabled={i===draft.testimonials.length-1}><ChevronDown size={13}/></button>
                        <button className={`${b.icon} !w-auto px-2.5 text-xs font-semibold`} onClick={()=>setModal({k:'edit-tmt',i})}><Pencil size={12}/>Edit</button>
                        <button className={b.iconDng} onClick={()=>setModal({k:'del',label:t.name,onConfirm:()=>delTmt(i)})}><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── PAGE HEROES ──────────────────────────────────── */}
            {active==='pages'&&(
              <div className="flex flex-col gap-5">
                <SectionHeader title="Page Heroes"/>
                <p className="text-[#888] text-sm -mt-2">Edit the banner image and title shown at the top of each public page.</p>
                {(['about','services','portfolio','gallery','contact'] as const).map((page,idx)=>{
                  const h=draft.pageHeroes[page];
                  return(
                    <PageHeroCard key={page} page={page} title={h.title} image={h.image} delay={idx*50}
                      onSave={(t,img)=>savePageHero(page,t,img)}/>
                  );
                })}
              </div>
            )}

            {/* ── CONTACT ──────────────────────────────────────── */}
            {active==='contact'&&(
              <div className="flex flex-col gap-5">
                <SectionHeader title="Contact Info"/>
                <p className="text-[#888] text-sm -mt-2">These values appear on the Contact page, booking links, and social icons.</p>

                {/* Contact details */}
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-scale-in">
                  <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] mb-4 flex items-center gap-1.5"><Phone size={11}/>Contact Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone"><input value={draft.contact.phone} onChange={e=>persist({...draft,contact:{...draft.contact,phone:e.target.value}})}/></Field>
                    <Field label="Email"><input type="email" value={draft.contact.email} onChange={e=>persist({...draft,contact:{...draft.contact,email:e.target.value}})}/></Field>
                    <Field label="WhatsApp Number (digits only, e.g. 250781691713)"><input value={draft.contact.whatsapp} onChange={e=>persist({...draft,contact:{...draft.contact,whatsapp:e.target.value}})}/></Field>
                    <Field label="Working Hours"><input value={draft.contact.hours} onChange={e=>persist({...draft,contact:{...draft.contact,hours:e.target.value}})}/></Field>
                  </div>
                  <div className="mt-4">
                    <Field label="Studio Address"><textarea rows={2} value={draft.contact.address} onChange={e=>persist({...draft,contact:{...draft.contact,address:e.target.value}})}/></Field>
                  </div>
                </div>

                {/* Social links */}
                <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm animate-fade-in-up" style={{animationDelay:'40ms'}}>
                  <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] mb-4 flex items-center gap-1.5"><Globe size={11}/>Social Links</p>
                  <div className="flex flex-col gap-3">
                    <Field label="Instagram URL"><input value={draft.contact.socials.instagram} onChange={e=>persist({...draft,contact:{...draft.contact,socials:{...draft.contact.socials,instagram:e.target.value}}})}/></Field>
                    <Field label="YouTube URL"><input value={draft.contact.socials.youtube} onChange={e=>persist({...draft,contact:{...draft.contact,socials:{...draft.contact.socials,youtube:e.target.value}}})}/></Field>
                    <Field label="LinkedIn URL"><input value={draft.contact.socials.linkedin} onChange={e=>persist({...draft,contact:{...draft.contact,socials:{...draft.contact.socials,linkedin:e.target.value}}})}/></Field>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-[#f9f9f9] border border-[#ebebeb] rounded-2xl p-5 animate-fade-in-up" style={{animationDelay:'80ms'}}>
                  <p className="text-xs font-bold text-[#aaa] uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5"><Eye size={11}/>WhatsApp Booking Link Preview</p>
                  <p className="text-xs text-[#888] font-mono break-all">
                    {`https://wa.me/${draft.contact.whatsapp}?text=Hello%20Flat%20Production%2C%20I%20would%20like%20to%20book%20a%20project.`}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ── MODALS ───────────────────────────────────────────────── */}
      {modal?.k==='add-svc'&&    <ServiceModal   onSave={item=>{saveSvc(item);setModal(null);}}                             onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-svc'&&   <ServiceModal   initial={draft.services[modal.i]}   onSave={item=>{saveSvc(item,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-pf'&&     <PortfolioModal services={draft.services}            onSave={item=>{savePf(item);setModal(null);}}          onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-pf'&&    <PortfolioModal initial={draft.portfolio[modal.i]}   services={draft.services} onSave={item=>{savePf(item,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-slide'&&  <SlideModal     onSave={(img,n)=>{addSlide(img,n);setModal(null);}}                        onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-slide'&& <SlideModal     initial={{image:imgs()[modal.i],note:nts()[modal.i]??''}} onSave={(img,n)=>{editSlide(modal.i,img,n);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-gal'&&    <GalleryModal   onSave={item=>{saveGal(item);setModal(null);}}                              onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-gal'&&   <GalleryModal   initial={draft.gallery[modal.i]}    onSave={item=>{saveGal(item,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-tm'&&     <TeamModal       onSave={item=>{saveTm(item);setModal(null);}}                              onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-tm'&&    <TeamModal       initial={draft.team[modal.i]}       onSave={item=>{saveTm(item,modal.i);setModal(null);}}  onClose={()=>setModal(null)}/>}
      {modal?.k==='add-logo'&&   <LogoModal       onSave={url=>{saveLogo(url);setModal(null);}}                              onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-logo'&&  <LogoModal       initial={draft.clientLogos[modal.i]} onSave={url=>{saveLogo(url,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='add-tmt'&&    <TestimonialModal onSave={item=>{saveTmt(item);setModal(null);}}                              onClose={()=>setModal(null)}/>}
      {modal?.k==='edit-tmt'&&   <TestimonialModal initial={draft.testimonials[modal.i]} onSave={item=>{saveTmt(item,modal.i);setModal(null);}} onClose={()=>setModal(null)}/>}
      {modal?.k==='del'&&        <ConfirmModal    label={modal.label} onConfirm={modal.onConfirm}                              onClose={()=>setModal(null)}/>}
      {modal?.k==='reset'&&      <ResetModal      hasBackup={hasBackup} onConfirm={resetToDefaults}                              onClose={()=>setModal(null)}/>}

      <Toast msg={toast}/>
    </div>
  );
};

export default AdminDashboard;
