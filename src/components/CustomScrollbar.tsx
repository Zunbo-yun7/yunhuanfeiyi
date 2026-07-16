import { useEffect, useRef, useState, type RefObject } from 'react'

/* ========== 招式定义 ========== */
interface Pose {
  name: string
  leftShoulder: number
  leftElbow: number
  rightShoulder: number
  rightElbow: number
  leftHip: number
  leftKnee: number
  rightHip: number
  rightKnee: number
  head: number
  bodyY: number
  bodyRot: number
}

// 8 种英歌舞招式（肩/肘/髋/膝角度 + 头部 + 躯干位移/旋转）
const POSES: Pose[] = [
  { name: '起势', leftShoulder: -20, leftElbow: 10, rightShoulder: 20, rightElbow: -10, leftHip: -8, leftKnee: 5, rightHip: 8, rightKnee: -5, head: 0, bodyY: 0, bodyRot: 0 },
  { name: '举锤', leftShoulder: -168, leftElbow: -12, rightShoulder: 168, rightElbow: 12, leftHip: -5, leftKnee: 0, rightHip: 5, rightKnee: 0, head: -10, bodyY: -3, bodyRot: 0 },
  { name: '横扫', leftShoulder: -80, leftElbow: -40, rightShoulder: 80, rightElbow: 40, leftHip: -15, leftKnee: 25, rightHip: 15, rightKnee: -25, head: 5, bodyY: 0, bodyRot: 0 },
  { name: '马步', leftShoulder: -88, leftElbow: -15, rightShoulder: 88, rightElbow: 15, leftHip: -28, leftKnee: 35, rightHip: 28, rightKnee: -35, head: 0, bodyY: 8, bodyRot: 0 },
  { name: '转身', leftShoulder: -45, leftElbow: -30, rightShoulder: 125, rightElbow: 55, leftHip: -10, leftKnee: 12, rightHip: 18, rightKnee: -15, head: 12, bodyY: 0, bodyRot: 10 },
  { name: '腾空', leftShoulder: -135, leftElbow: -18, rightShoulder: 135, rightElbow: 18, leftHip: 18, leftKnee: 38, rightHip: -18, rightKnee: -38, head: -8, bodyY: -16, bodyRot: 0 },
  { name: '劈砸', leftShoulder: -25, leftElbow: -75, rightShoulder: 25, rightElbow: 75, leftHip: -12, leftKnee: 18, rightHip: 12, rightKnee: -18, head: 8, bodyY: 5, bodyRot: 0 },
  { name: '收势', leftShoulder: -15, leftElbow: 5, rightShoulder: 15, rightElbow: -5, leftHip: -5, leftKnee: 0, rightHip: 5, rightKnee: 0, head: 5, bodyY: 0, bodyRot: 0 },
]

/* ========== 插值函数 ========== */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
// smoothstep 使招式切换更自然——在每式开始/结束处减速
const smoothstep = (t: number) => t * t * (3 - 2 * t)

function getPose(progress: number) {
  const p = Math.max(0, Math.min(0.999, progress))
  const scaled = p * (POSES.length - 1)
  const idx = Math.floor(scaled)
  const t = smoothstep(scaled - idx)
  const a = POSES[idx]
  const b = POSES[Math.min(idx + 1, POSES.length - 1)]
  return {
    leftShoulder: lerp(a.leftShoulder, b.leftShoulder, t),
    leftElbow: lerp(a.leftElbow, b.leftElbow, t),
    rightShoulder: lerp(a.rightShoulder, b.rightShoulder, t),
    rightElbow: lerp(a.rightElbow, b.rightElbow, t),
    leftHip: lerp(a.leftHip, b.leftHip, t),
    leftKnee: lerp(a.leftKnee, b.leftKnee, t),
    rightHip: lerp(a.rightHip, b.rightHip, t),
    rightKnee: lerp(a.rightKnee, b.rightKnee, t),
    head: lerp(a.head, b.head, t),
    bodyY: lerp(a.bodyY, b.bodyY, t),
    bodyRot: lerp(a.bodyRot, b.bodyRot, t),
    name: t < 0.5 ? a.name : b.name,
  }
}

/* ========== 辅助组件：手臂（肩→肘→手锤） ========== */
type DivRef = RefObject<HTMLDivElement>

function ArmLimb({ shoulderRef, elbowRef, left }: { shoulderRef: DivRef; elbowRef: DivRef; left: number }) {
  return (
    <div ref={shoulderRef} style={{
      position: 'absolute', left: `${left}px`, top: '24px',
      width: '6px', height: '20px',
      transformStyle: 'preserve-3d', transformOrigin: 'top center',
      willChange: 'transform',
    }}>
      {/* 肩甲 */}
      <div style={{
        position: 'absolute', top: '-4px', left: '-3px',
        width: '12px', height: '7px',
        background: 'linear-gradient(180deg, #C82828, #5C0000)',
        borderRadius: '50%', transform: 'translateZ(3px)',
      }} />
      {/* 上臂 */}
      <div style={{
        width: '6px', height: '20px',
        background: 'linear-gradient(90deg, #C82828, #9B0000 50%, #5C0000)',
        borderRadius: '3px', boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.3)',
      }} />
      {/* 肘关节 */}
      <div ref={elbowRef} style={{
        position: 'absolute', top: '18px', left: 0,
        width: '6px', height: '18px',
        transformStyle: 'preserve-3d', transformOrigin: 'top center',
        willChange: 'transform',
      }}>
        {/* 前臂 */}
        <div style={{
          width: '6px', height: '18px',
          background: 'linear-gradient(90deg, #C82828, #9B0000 50%, #5C0000)',
          borderRadius: '3px', boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.3)',
        }} />
        {/* 护腕 */}
        <div style={{
          position: 'absolute', bottom: '0', left: '-2px',
          width: '10px', height: '4px',
          background: 'linear-gradient(90deg, #8A6830, #C8A060 50%, #8A6830)',
          borderRadius: '2px', transform: 'translateZ(2px)',
        }} />
        {/* 手 */}
        <div style={{
          position: 'absolute', top: '17px', left: '0',
          width: '6px', height: '4px',
          background: 'linear-gradient(135deg, #F0D0A8, #C8A070)',
          borderRadius: '40%', transform: 'translateZ(2px)',
        }} />
        {/* 锤柄 */}
        <div style={{
          position: 'absolute', top: '20px', left: '1.5px',
          width: '3px', height: '12px',
          background: 'linear-gradient(90deg, #8B6940, #A07848, #6B5030)',
          borderRadius: '1.5px', transform: 'translateZ(2px)',
        }} />
        {/* 锤头 */}
        <div style={{
          position: 'absolute', top: '30px', left: '-3px',
          width: '12px', height: '7px',
          background: 'linear-gradient(180deg, #F0DCA0, #C8A060 50%, #806020)',
          borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
          transform: 'translateZ(3px)',
        }} />
      </div>
    </div>
  )
}

/* ========== 辅助组件：腿（髋→膝→靴） ========== */
function LegLimb({ hipRef, kneeRef, left }: { hipRef: DivRef; kneeRef: DivRef; left: number }) {
  return (
    <div ref={hipRef} style={{
      position: 'absolute', left: `${left}px`, top: '56px',
      width: '7px', height: '25px',
      transformStyle: 'preserve-3d', transformOrigin: 'top center',
      willChange: 'transform',
    }}>
      {/* 大腿 */}
      <div style={{
        width: '7px', height: '25px',
        background: 'linear-gradient(90deg, #8B0000, #6B0000 50%, #4B0000)',
        borderRadius: '3.5px', boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.3)',
      }} />
      {/* 膝关节 */}
      <div ref={kneeRef} style={{
        position: 'absolute', top: '23px', left: 0,
        width: '7px', height: '23px',
        transformStyle: 'preserve-3d', transformOrigin: 'top center',
        willChange: 'transform',
      }}>
        {/* 小腿 */}
        <div style={{
          width: '7px', height: '23px',
          background: 'linear-gradient(90deg, #8B0000, #6B0000 50%, #4B0000)',
          borderRadius: '3.5px', boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.3)',
        }} />
        {/* 靴子 */}
        <div style={{
          position: 'absolute', bottom: '-3px', left: '-4px',
          width: '15px', height: '7px',
          background: 'linear-gradient(180deg, #2A2018, #0A0805)',
          borderRadius: '3px 3px 4px 4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
          transform: 'translateZ(2px)',
        }} />
      </div>
    </div>
  )
}

/* ========== 主组件 ========== */
export function CustomScrollbar() {
  const [poseName, setPoseName] = useState('起势')
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const lastPoseRef = useRef('起势')

  // 关节 refs
  const headRef = useRef<HTMLDivElement>(null)
  const torsoRef = useRef<HTMLDivElement>(null)
  const leftShoulderRef = useRef<HTMLDivElement>(null)
  const leftElbowRef = useRef<HTMLDivElement>(null)
  const rightShoulderRef = useRef<HTMLDivElement>(null)
  const rightElbowRef = useRef<HTMLDivElement>(null)
  const leftHipRef = useRef<HTMLDivElement>(null)
  const leftKneeRef = useRef<HTMLDivElement>(null)
  const rightHipRef = useRef<HTMLDivElement>(null)
  const rightKneeRef = useRef<HTMLDivElement>(null)
  const scarfRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const charRootRef = useRef<HTMLDivElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number
    let lastScroll = window.scrollY
    let velocity = 0
    let smoothedVel = 0

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    const animate = () => {
      const scrollY = window.scrollY
      const progress = scrollY / maxScroll()

      velocity = scrollY - lastScroll
      lastScroll = scrollY
      smoothedVel = smoothedVel * 0.88 + velocity * 0.12

      const pose = getPose(progress)
      const t = performance.now() * 0.001

      // 待机微动画
      const breathe = Math.sin(t * 2.2) * 0.5
      const sway = Math.sin(t * 0.8) * 0.6
      const headBob = Math.sin(t * 1.5) * 0.4
      const scarfWave = Math.sin(t * 1.8) * 6

      // 工具函数：安全设置 transform
      const xform = (ref: DivRef, transform: string) => {
        if (ref.current) ref.current.style.transform = transform
      }

      // === 应用关节变换（translateZ 深度 + rotateZ 角度）===
      xform(headRef, `translateZ(10px) rotateZ(${pose.head + headBob}deg)`)
      xform(torsoRef, `translateY(${pose.bodyY + breathe * 0.3}px) rotateZ(${pose.bodyRot + sway}deg)`)
      xform(leftShoulderRef, `translateZ(15px) rotateZ(${pose.leftShoulder + breathe * 0.3}deg)`)
      xform(leftElbowRef, `rotateZ(${pose.leftElbow}deg)`)
      xform(rightShoulderRef, `translateZ(-8px) rotateZ(${pose.rightShoulder - breathe * 0.3}deg)`)
      xform(rightElbowRef, `rotateZ(${pose.rightElbow}deg)`)
      xform(leftHipRef, `translateZ(10px) rotateZ(${pose.leftHip}deg)`)
      xform(leftKneeRef, `rotateZ(${pose.leftKnee}deg)`)
      xform(rightHipRef, `translateZ(-12px) rotateZ(${pose.rightHip}deg)`)
      xform(rightKneeRef, `rotateZ(${pose.rightKnee}deg)`)
      xform(scarfRef, `translateZ(-10px) rotateZ(${scarfWave}deg)`)

      // 影子：随跳跃高度缩放
      if (shadowRef.current) {
        const s = 1 + Math.abs(pose.bodyY) * 0.02
        const o = Math.max(0.15, 0.35 + pose.bodyY * 0.012)
        shadowRef.current.style.transform = `rotateX(90deg) translateZ(-80px) scale(${s})`
        shadowRef.current.style.opacity = String(o)
      }

      // 3D 倾斜：基于滚动速度的 rotateY
      if (charRootRef.current) {
        const tilt = Math.max(-15, Math.min(15, smoothedVel * 0.3))
        charRootRef.current.style.transform = `rotateY(${tilt}deg)`
      }

      // 运动模糊
      if (blurRef.current) {
        const blur = Math.min(1.5, Math.abs(smoothedVel) * 0.06)
        blurRef.current.style.filter = blur > 0.1 ? `blur(${blur}px)` : ''
      }

      // 发光强度
      if (glowRef.current) {
        const intensity = Math.min(1, Math.abs(smoothedVel) * 0.04)
        glowRef.current.style.opacity = String(0.25 + intensity * 0.75)
      }

      // 滑块位置（直接操作 DOM 避免 re-render）
      if (thumbRef.current) {
        thumbRef.current.style.top = `calc(${progress * 100}% - 65px)`
      }

      // 招式名（仅变化时更新 state）
      if (pose.name !== lastPoseRef.current) {
        lastPoseRef.current = pose.name
        setPoseName(pose.name)
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current || isDraggingRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const progress = clickY / rect.height
    const targetScroll = progress * (document.documentElement.scrollHeight - window.innerHeight)
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDraggingRef.current = true
    const startY = e.clientY
    const startScroll = window.scrollY
    const trackHeight = trackRef.current?.getBoundingClientRect().height || 1
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight

    const onMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return
      const deltaY = ev.clientY - startY
      window.scrollTo({ top: startScroll + (deltaY / trackHeight) * scrollRange })
    }
    const onUp = () => {
      isDraggingRef.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          html::-webkit-scrollbar,
          body::-webkit-scrollbar { width: 0; background: transparent; }
          html::-webkit-scrollbar-track,
          body::-webkit-scrollbar-track { background: transparent; }
          html::-webkit-scrollbar-thumb,
          body::-webkit-scrollbar-thumb { background: transparent; }
          html, body { scrollbar-width: none; -ms-overflow-style: none; }
        }
      `}</style>

      <div
        className="hidden md:block fixed top-0 right-0 w-[96px] h-full z-[9998] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(139,0,0,0.06) 0%, rgba(200,160,96,0.03) 50%, rgba(139,0,0,0.06) 100%)',
          borderLeft: '1px solid rgba(200,160,96,0.15)',
        }}
      >
        {/* 发光层 */}
        <div ref={glowRef} className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 30% at 50% 50%, rgba(255,180,80,0.12) 0%, transparent 70%)',
          opacity: 0.25,
        }} />

        {/* 轨道 */}
        <div
          ref={trackRef}
          className="absolute top-0 right-[10px] w-[76px] h-full cursor-pointer pointer-events-auto"
          onClick={handleTrackClick}
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(200,160,96,0.06) 24px, rgba(200,160,96,0.06) 25px)',
            borderRadius: '24px',
          }}
        >
          {/* 滑块 + 3D 舞者 */}
          <div
            ref={thumbRef}
            className="absolute left-1/2 -translate-x-1/2 w-[90px] cursor-grab active:cursor-grabbing"
            style={{ top: 'calc(0% - 65px)' }}
            onMouseDown={handleThumbMouseDown}
          >
            {/* 运动模糊容器 */}
            <div ref={blurRef} style={{ transition: 'filter 0.1s ease' }}>
              {/* 3D 透视舞台 */}
              <div style={{ perspective: '500px', perspectiveOrigin: 'center 40%' }}>
                {/* 角色 3D 根节点 —— preserve-3d 使子元素在 3D 空间中定位 */}
                <div
                  ref={charRootRef}
                  style={{
                    transformStyle: 'preserve-3d',
                    width: '70px',
                    height: '130px',
                    margin: '0 auto',
                    position: 'relative',
                    willChange: 'transform',
                  }}
                >
                  {/* === 地面影子 === */}
                  <div ref={shadowRef} style={{
                    position: 'absolute', bottom: '-5px', left: '50%',
                    width: '50px', height: '10px', marginLeft: '-25px',
                    background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
                    transform: 'rotateX(90deg) translateZ(-80px)',
                    transformOrigin: 'center',
                  }} />

                  {/* === 飘带（身后） === */}
                  <div ref={scarfRef} style={{
                    position: 'absolute', top: '28px', left: '50%',
                    width: '20px', height: '36px', marginLeft: '-10px',
                    background: 'linear-gradient(180deg, #DC2828, #8B0000)',
                    borderRadius: '40% 40% 50% 50%',
                    opacity: 0.65,
                    transformOrigin: 'top center',
                    willChange: 'transform',
                  }} />

                  {/* === 右臂（身后 depth=-8） === */}
                  <ArmLimb shoulderRef={rightShoulderRef} elbowRef={rightElbowRef} left={46} />

                  {/* === 右腿（身后 depth=-12） === */}
                  <LegLimb hipRef={rightHipRef} kneeRef={rightKneeRef} left={39} />

                  {/* === 躯干（中心 depth=0） === */}
                  <div ref={torsoRef} style={{
                    position: 'absolute', top: '22px', left: '50%',
                    width: '28px', height: '36px', marginLeft: '-14px',
                    transformStyle: 'preserve-3d', transformOrigin: 'center',
                    willChange: 'transform',
                  }}>
                    {/* 胸甲正面 */}
                    <div style={{
                      position: 'absolute', width: '28px', height: '36px',
                      background: 'linear-gradient(135deg, #C82828 0%, #9B0000 40%, #5C0000 100%)',
                      borderRadius: '6px 6px 4px 4px',
                      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                      transform: 'translateZ(6px)',
                    }} />
                    {/* 高光 */}
                    <div style={{
                      position: 'absolute', width: '8px', height: '30px',
                      left: '3px', top: '3px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)',
                      borderRadius: '3px',
                      transform: 'translateZ(7px)',
                    }} />
                    {/* 腰带 */}
                    <div style={{
                      position: 'absolute', bottom: '0', width: '30px', height: '6px',
                      left: '-1px',
                      background: 'linear-gradient(90deg, #8A6830, #C8A060 50%, #8A6830)',
                      borderRadius: '2px',
                      transform: 'translateZ(7px)',
                    }} />
                    {/* 腰带扣 */}
                    <div style={{
                      position: 'absolute', bottom: '-1px', left: '50%',
                      width: '7px', height: '7px', marginLeft: '-3.5px',
                      background: 'radial-gradient(circle, #F0DCA0, #C8A060)',
                      borderRadius: '50%',
                      transform: 'translateZ(8px)',
                    }} />
                    {/* 胸口徽记 */}
                    <div style={{
                      position: 'absolute', top: '10px', left: '50%',
                      width: '8px', height: '8px', marginLeft: '-4px',
                      border: '1.5px solid #C8A060',
                      borderRadius: '50%',
                      transform: 'translateZ(8px)',
                    }} />
                  </div>

                  {/* === 头部（depth=10） === */}
                  <div ref={headRef} style={{
                    position: 'absolute', top: '0', left: '50%',
                    width: '22px', height: '26px', marginLeft: '-11px',
                    transformStyle: 'preserve-3d', transformOrigin: 'bottom center',
                    willChange: 'transform',
                  }}>
                    {/* 脸 */}
                    <div style={{
                      position: 'absolute', top: '5px', left: '1px',
                      width: '20px', height: '20px',
                      background: 'linear-gradient(135deg, #F0D0A8, #C8A070)',
                      borderRadius: '45% 45% 35% 35%',
                      transform: 'translateZ(6px)',
                    }} />
                    {/* 头盔 */}
                    <div style={{
                      position: 'absolute', top: '0', left: '0',
                      width: '22px', height: '12px',
                      background: 'linear-gradient(180deg, #F0DCA0, #C8A060 50%, #8A6830)',
                      borderRadius: '50% 50% 15% 15%',
                      transform: 'translateZ(5px)',
                    }} />
                    {/* 羽翎中 */}
                    <div style={{
                      position: 'absolute', top: '-10px', left: '50%',
                      width: '4px', height: '12px', marginLeft: '-2px',
                      background: 'linear-gradient(180deg, #DC2828, #8B0000)',
                      borderRadius: '50% 50% 0 0',
                      transform: 'translateZ(6px) rotate(-12deg)',
                    }} />
                    {/* 羽翎左 */}
                    <div style={{
                      position: 'absolute', top: '-6px', left: '2px',
                      width: '7px', height: '10px',
                      background: '#DC2828',
                      borderRadius: '50%', opacity: 0.7,
                      transform: 'translateZ(4px) rotate(-35deg)',
                    }} />
                    {/* 羽翎右 */}
                    <div style={{
                      position: 'absolute', top: '-6px', right: '2px',
                      width: '7px', height: '10px',
                      background: '#DC2828',
                      borderRadius: '50%', opacity: 0.7,
                      transform: 'translateZ(4px) rotate(35deg)',
                    }} />
                    {/* 左眼 */}
                    <div style={{
                      position: 'absolute', top: '11px', left: '4px',
                      width: '2.5px', height: '3px',
                      background: '#1a0a0a', borderRadius: '50%',
                      transform: 'translateZ(7px)',
                    }} />
                    {/* 右眼 */}
                    <div style={{
                      position: 'absolute', top: '11px', right: '4px',
                      width: '2.5px', height: '3px',
                      background: '#1a0a0a', borderRadius: '50%',
                      transform: 'translateZ(7px)',
                    }} />
                    {/* 脸谱红纹 */}
                    <div style={{
                      position: 'absolute', top: '5px', left: '50%',
                      width: '1.5px', height: '16px', marginLeft: '-0.75px',
                      background: '#B22222', opacity: 0.4,
                      transform: 'translateZ(7px)',
                    }} />
                  </div>

                  {/* === 左腿（身前 depth=10） === */}
                  <LegLimb hipRef={leftHipRef} kneeRef={leftKneeRef} left={24} />

                  {/* === 左臂（身前 depth=15） === */}
                  <ArmLimb shoulderRef={leftShoulderRef} elbowRef={leftElbowRef} left={18} />
                </div>
              </div>
            </div>

            {/* 轨道线 */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[2px] top-0 bottom-0" style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(200,160,96,0.4) 20%, rgba(200,160,96,0.6) 50%, rgba(200,160,96,0.4) 80%, transparent 100%)',
              zIndex: -1,
            }} />
          </div>

          {/* 顶部标识 */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-serif whitespace-nowrap" style={{ color: 'rgba(200,160,96,0.5)', writingMode: 'vertical-rl' }}>
            起
          </div>
          {/* 底部标识 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-serif whitespace-nowrap" style={{ color: 'rgba(200,160,96,0.5)', writingMode: 'vertical-rl' }}>
            落
          </div>
          {/* 当前招式名 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-serif whitespace-nowrap pointer-events-none" style={{
            color: 'rgba(178,34,34,0.4)', writingMode: 'vertical-rl',
            letterSpacing: '2px', marginTop: '80px',
          }}>
            {poseName}
          </div>
        </div>

        {/* 中心装饰线 */}
        <div className="absolute top-1/2 right-3 -translate-y-1/2 w-[1px] h-16" style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,160,96,0.25) 50%, transparent 100%)',
        }} />
      </div>
    </>
  )
}
