import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Github, Linkedin, Mail, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section } from './Sections'
import { profile as p } from '../data/profile'
export default function Contact(){
  const reducedMotion=useReducedMotion()
  const reveal=reducedMotion?{}:{initial:{opacity:0},whileInView:{opacity:1},viewport:{once:false,amount:.2},transition:{duration:.55}}
  const [f,setF]=useState({name:'',email:'',subject:'',message:''})
  const set=(k:string)=>(e:any)=>setF({...f,[k]:e.target.value})
  const href=`mailto:${p.email}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(`${f.message}\n\n${f.name} (${f.email})`)}`
  const ic="contact-input"
  const contactIcons:Record<string,LucideIcon>={EMAIL:Mail,PHONE:Phone,GITHUB:Github,LINKEDIN:Linkedin}
  const contactDetails=[
    ...(p.email?[{label:'EMAIL',value:p.email,href:`mailto:${p.email}`}]:[]),
    ...(p.phone?[{label:'PHONE',value:p.phone,href:`tel:${p.phone.replace(/[^+\d]/g,'')}`}]:[]),
    ...(p.github?[{label:'GITHUB',value:p.github,href:p.github}]:[]),
    ...(p.linkedin?[{label:'LINKEDIN',value:p.linkedin,href:p.linkedin}]:[]),
  ]
  return <Section id="contact" title="Let's Connect"><div className="contact-layout">
    <motion.aside className="contact-card" {...reveal}><span className="panel-kicker">HAVE A PROJECT IN MIND?</span><h3>Let&apos;s make<br/><em>something useful.</em></h3><p>I&apos;m ready to learn, contribute, and grow in a professional environment.</p><ul>{contactDetails.map(({label,value,href})=>{const Icon=contactIcons[label];return <li key={label}><Icon className="contact-detail-icon" size={15} aria-hidden="true"/><span>{label}</span>{href?<a href={href} target={href.startsWith('http')?'_blank':undefined} rel={href.startsWith('http')?'noreferrer':undefined}>{value}</a>:value}</li>})}</ul></motion.aside>
    <motion.div className="contact-form-card" {...reveal}><span className="panel-kicker">SEND A MESSAGE / 01</span><div className="contact-fields">{(['name','email','subject'] as const).map(k=><label key={k} className="contact-field">{k==='name'?'Full Name':k}<input className={ic} value={f[k]} onChange={set(k)}/></label>)}
      <label className="contact-field">Message<textarea rows={4} className={ic} value={f.message} onChange={set('message')}/></label>
      {p.email?<a href={href} className="contact-submit">Open in email app <ExternalLink size={15}/></a>:<p className="text-sm text-mute">Set your email in profile.ts to enable this form. It opens your email app (mailto); it does not send messages by itself.</p>}</div></motion.div></div></Section>
}
