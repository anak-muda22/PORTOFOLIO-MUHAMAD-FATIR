import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const profileImage = './profile.jpeg'

export default function ThreeAvatar() {
  const hostRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let animationFrame = 0
    let renderer: import('three').WebGLRenderer | undefined
    let scene: import('three').Scene | undefined
    let observer: ResizeObserver | undefined
    let threeModule: typeof import('three') | undefined
    let profileTexture: import('three').Texture | undefined
    let overlayTexture: import('three').CanvasTexture | undefined

    const pointer = { x: 0, y: 0 }
    const targetPointer = { x: 0, y: 0 }
    const cardPosition = { x: 0, y: -0.12 }
    const targetCardPosition = { x: 0, y: -0.12 }
    const cardVelocity = { x: 0, y: 0 }
    const dragOffset = { x: 0, y: 0 }
    let pointerInside = false
    let dragging = false
    let targetScroll = 0
    let scrollProgress = 0
    let profileMaterial: import('three').ShaderMaterial | undefined

    const pointerNdc = { x: 0, y: 0 }
    const updatePointerPosition = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      pointerInside = true
      pointerNdc.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointerNdc.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      targetPointer.x = pointerNdc.x
      targetPointer.y = -pointerNdc.y
    }

    const onPointerMove = (event: PointerEvent) => {
      updatePointerPosition(event)
      if (!dragging || !threeModule || !scene) return
      const camera = scene.userData.camera as import('three').PerspectiveCamera
      const raycaster = scene.userData.raycaster as import('three').Raycaster
      const dragPlane = scene.userData.dragPlane as import('three').Plane
      raycaster.setFromCamera(new threeModule.Vector2(pointerNdc.x, pointerNdc.y), camera)
      const point = raycaster.ray.intersectPlane(dragPlane, new threeModule.Vector3())
      if (!point) return
      targetCardPosition.x = threeModule.MathUtils.clamp(point.x - dragOffset.x, -1.05, 1.05)
      targetCardPosition.y = threeModule.MathUtils.clamp(point.y - dragOffset.y, -0.05, 0.45)
    }

    const onPointerDown = (event: PointerEvent) => {
      updatePointerPosition(event)
      if (!threeModule || !scene) return
      const camera = scene.userData.camera as import('three').PerspectiveCamera
      const raycaster = scene.userData.raycaster as import('three').Raycaster
      const cardTargets = scene.userData.cardTargets as import('three').Object3D[]
      raycaster.setFromCamera(new threeModule.Vector2(pointerNdc.x, pointerNdc.y), camera)
      const hit = raycaster.intersectObjects(cardTargets, false)[0]
      if (!hit) return
      const card = scene.userData.card as import('three').Group
      dragging = true
      dragOffset.x = hit.point.x - card.position.x
      dragOffset.y = hit.point.y - card.position.y
      host.classList.add('is-card-dragging')
      host.setPointerCapture(event.pointerId)
    }

    const finishDrag = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      targetCardPosition.x = 0
      targetCardPosition.y = -0.12
      host.classList.remove('is-card-dragging')
      if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId)
    }

    const onPointerLeave = () => {
      if (dragging) return
      pointerInside = false
      targetPointer.x = 0
      targetPointer.y = 0
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      targetScroll = scrollable > 0 ? window.scrollY / scrollable : 0
    }

    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointerup', finishDrag)
    host.addEventListener('pointercancel', finishDrag)
    host.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    import('three').then(THREE => {
      if (disposed) return
      threeModule = THREE

      scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
      camera.position.set(0, 0.18, 9.5)
      const raycaster = new THREE.Raycaster()
      const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      scene.userData.camera = camera
      scene.userData.raycaster = raycaster
      scene.userData.dragPlane = dragPlane
      scene.userData.cardTargets = []

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.setAttribute('aria-hidden', 'true')
      host.appendChild(renderer.domElement)

      scene.add(new THREE.HemisphereLight(0xc9dcff, 0x101322, 1.8))
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
      keyLight.position.set(-3, 5, 6)
      scene.add(keyLight)
      const rimLight = new THREE.PointLight(0x4c79ff, 24, 12)
      rimLight.position.set(2.5, 1.5, -1.5)
      scene.add(rimLight)

      const cardWidth = 2.42
      const cardHeight = 3.23
      const cardRadius = 0.16
      const cardShape = new THREE.Shape()
      cardShape.moveTo(-cardWidth / 2 + cardRadius, -cardHeight / 2)
      cardShape.lineTo(cardWidth / 2 - cardRadius, -cardHeight / 2)
      cardShape.quadraticCurveTo(cardWidth / 2, -cardHeight / 2, cardWidth / 2, -cardHeight / 2 + cardRadius)
      cardShape.lineTo(cardWidth / 2, cardHeight / 2 - cardRadius)
      cardShape.quadraticCurveTo(cardWidth / 2, cardHeight / 2, cardWidth / 2 - cardRadius, cardHeight / 2)
      cardShape.lineTo(-cardWidth / 2 + cardRadius, cardHeight / 2)
      cardShape.quadraticCurveTo(-cardWidth / 2, cardHeight / 2, -cardWidth / 2, cardHeight / 2 - cardRadius)
      cardShape.lineTo(-cardWidth / 2, -cardHeight / 2 + cardRadius)
      cardShape.quadraticCurveTo(-cardWidth / 2, -cardHeight / 2, -cardWidth / 2 + cardRadius, -cardHeight / 2)

      const cardMaterial = new THREE.MeshStandardMaterial({
        color: 0x121b31,
        metalness: 0.48,
        roughness: 0.32,
      })
      const cardGeometry = new THREE.ExtrudeGeometry(cardShape, {
        depth: 0.09,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025,
      })
      const cardBacking = new THREE.Mesh(cardGeometry, cardMaterial)
      const card = new THREE.Group()
      card.position.set(0, cardPosition.y, 0.12)
      card.add(cardBacking)
      scene.add(card)
      scene.userData.card = card

      const imageWidth = cardWidth - 0.24
      const imageHeight = cardHeight - 0.24
      let photoMesh: import('three').Mesh | undefined

      const overlayCanvas = document.createElement('canvas')
      overlayCanvas.width = 512
      overlayCanvas.height = 684
      const overlayContext = overlayCanvas.getContext('2d')
      if (!overlayContext) throw new Error('Unable to create the ID card overlay.')
      const headerShade = overlayContext.createLinearGradient(0, 0, 0, 130)
      headerShade.addColorStop(0, 'rgba(5, 10, 22, .62)')
      headerShade.addColorStop(1, 'rgba(5, 10, 22, 0)')
      overlayContext.fillStyle = headerShade
      overlayContext.fillRect(0, 0, 512, 130)
      const bottomShade = overlayContext.createLinearGradient(0, 430, 0, 684)
      bottomShade.addColorStop(0, 'rgba(5, 9, 18, 0)')
      bottomShade.addColorStop(0.42, 'rgba(5, 9, 18, .66)')
      bottomShade.addColorStop(1, 'rgba(5, 9, 18, .96)')
      overlayContext.fillStyle = bottomShade
      overlayContext.fillRect(0, 430, 512, 254)
      overlayContext.fillStyle = '#b7caff'
      overlayContext.font = '600 19px system-ui, sans-serif'
      overlayContext.letterSpacing = '3px'
      overlayContext.fillText('PERSONAL ID', 32, 48)
      overlayContext.fillStyle = '#ffffff'
      overlayContext.font = '700 31px system-ui, sans-serif'
      overlayContext.letterSpacing = '1px'
      overlayContext.fillText('MUHAMAD FATIR', 32, 606)
      overlayContext.fillStyle = '#a8b7d4'
      overlayContext.font = '500 16px system-ui, sans-serif'
      overlayContext.letterSpacing = '3px'
      overlayContext.fillText('IT ENTHUSIAST', 32, 640)
      overlayContext.fillStyle = '#77a0ff'
      overlayContext.fillRect(32, 657, 448, 2)
      overlayTexture = new THREE.CanvasTexture(overlayCanvas)
      overlayTexture.colorSpace = THREE.SRGBColorSpace

      const overlayMaterial = new THREE.MeshBasicMaterial({
        map: overlayTexture,
        transparent: true,
        depthWrite: false,
      })
      const overlayMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(imageWidth, imageHeight),
        overlayMaterial,
      )
      overlayMesh.position.z = 0.17
      card.add(overlayMesh)

      const photoPlaceholder = new THREE.Mesh(
        new THREE.PlaneGeometry(imageWidth, imageHeight),
        new THREE.MeshBasicMaterial({ color: 0x102b62 }),
      )
      photoPlaceholder.position.z = 0.15
      card.add(photoPlaceholder)

      const clipMaterial = new THREE.MeshStandardMaterial({
        color: 0xbfc9dc,
        metalness: 0.82,
        roughness: 0.22,
      })
      const clip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.09), clipMaterial)
      clip.position.set(0, cardHeight / 2 + 0.04, 0.08)
      card.add(clip)
      const clipLoop = new THREE.Mesh(
        new THREE.TorusGeometry(0.13, 0.025, 8, 24),
        clipMaterial,
      )
      clipLoop.position.set(0, cardHeight / 2 + 0.17, 0.06)
      card.add(clipLoop)

      const cardTargets: import('three').Object3D[] = [photoPlaceholder]
      scene.userData.cardTargets = cardTargets

      const strapMaterial = new THREE.MeshBasicMaterial({
        color: 0x526ead,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      })
      const strapMeshes: import('three').Mesh[] = []
      const strapAnchors = [-0.62, 0.62]
      const strapSegments = 28
      for (let strapIndex = 0; strapIndex < strapAnchors.length; strapIndex += 1) {
        const positions = new Float32Array((strapSegments + 1) * 2 * 3)
        const indices: number[] = []
        for (let segment = 0; segment < strapSegments; segment += 1) {
          const current = segment * 2
          indices.push(current, current + 1, current + 2, current + 1, current + 3, current + 2)
        }
        const ribbonGeometry = new THREE.BufferGeometry()
        ribbonGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        ribbonGeometry.setIndex(indices)
        const ribbon = new THREE.Mesh(ribbonGeometry, strapMaterial)
        ribbon.frustumCulled = false
        scene.add(ribbon)
        strapMeshes.push(ribbon)
      }

      const updateStrap = (strapIndex: number) => {
        const anchorX = strapAnchors[strapIndex]
        const endpoint = card.localToWorld(new THREE.Vector3(anchorX, cardHeight / 2 - 0.04, 0.07))
        const start = new THREE.Vector3(anchorX * 0.92, 2.55, 0.3)
        const curve = new THREE.CatmullRomCurve3([
          start,
          new THREE.Vector3(anchorX * 1.12, 2.18, 0.34),
          new THREE.Vector3(endpoint.x * 0.92, 1.9, 0.34),
          new THREE.Vector3(endpoint.x, endpoint.y, 0.34),
        ])
        const points = curve.getPoints(strapSegments)
        const attribute = strapMeshes[strapIndex].geometry.getAttribute('position') as import('three').BufferAttribute
        for (let i = 0; i <= strapSegments; i += 1) {
          const tangent = curve.getTangent(i / strapSegments)
          const side = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize().multiplyScalar(0.055)
          const left = points[i].clone().add(side)
          const right = points[i].clone().sub(side)
          attribute.setXYZ(i * 2, left.x, left.y, left.z)
          attribute.setXYZ(i * 2 + 1, right.x, right.y, right.z)
        }
        attribute.needsUpdate = true
        strapMeshes[strapIndex].geometry.computeVertexNormals()
      }

      const starPositions = new Float32Array(240)
      for (let i = 0; i < starPositions.length; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 5.2
        starPositions[i + 1] = (Math.random() - 0.5) * 4.5
        starPositions[i + 2] = (Math.random() - 0.5) * 2.2 - 0.6
      }
      const starGeometry = new THREE.BufferGeometry()
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
      const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({ color: 0x9cb4ff, size: 0.018, transparent: true, opacity: 0.7 }),
      )
      scene.add(stars)

      new THREE.TextureLoader().load(profileImage, texture => {
        if (disposed) {
          texture.dispose()
          return
        }
        profileTexture = texture
        texture.colorSpace = THREE.SRGBColorSpace
        profileMaterial = new THREE.ShaderMaterial({
          uniforms: {
            portraitMap: { value: texture },
            cursorUv: { value: new THREE.Vector2(0.5, 0.5) },
            maskStrength: { value: 0 },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D portraitMap;
            uniform vec2 cursorUv;
            uniform float maskStrength;
            varying vec2 vUv;
            void main() {
              vec4 photo = texture2D(portraitMap, vUv);
              float distanceToCursor = distance(vUv, cursorUv);
              float edge = smoothstep(0.2, 0.215, distanceToCursor) *
                (1.0 - smoothstep(0.215, 0.23, distanceToCursor));
              vec3 revealed = photo.rgb + vec3(0.12, 0.28, 0.8) * edge;
              float blueScreen = smoothstep(0.08, 0.28, photo.b - photo.r) *
                smoothstep(0.12, 0.3, photo.b - photo.g);
              float roundedCorner = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
              float cornerMask = smoothstep(0.0, 0.025, roundedCorner);
              gl_FragColor = vec4(mix(photo.rgb, revealed, maskStrength), (1.0 - blueScreen) * cornerMask);
            }
          `,
          transparent: true,
          depthWrite: false,
        })
        photoMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(imageWidth - 0.045, imageHeight - 0.045),
          profileMaterial,
        )
        photoMesh.position.z = 0.16
        card.add(photoMesh)
        cardTargets.push(photoMesh)
        photoPlaceholder.visible = false
      }, undefined, error => {
        console.error('Unable to load the profile portrait:', error)
      })

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.7, 0.008, 8, 150),
        new THREE.MeshBasicMaterial({ color: 0x4c79ff, transparent: true, opacity: 0.25 }),
      )
      ring.position.z = -0.8
      ring.rotation.x = 1.22
      ring.rotation.y = -0.2
      scene.add(ring)

      const resize = () => {
        if (!renderer) return
        const { width, height } = host.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }

      observer = new ResizeObserver(resize)
      observer.observe(host)
      resize()

      const render = (time = 0) => {
        if (disposed || !renderer || !scene) {
          if (!disposed) animationFrame = window.requestAnimationFrame(render)
          return
        }
        const seconds = reducedMotion ? 0 : time * 0.001
        pointer.x += (targetPointer.x - pointer.x) * 0.08
        pointer.y += (targetPointer.y - pointer.y) * 0.08
        scrollProgress += (targetScroll - scrollProgress) * 0.025

        cardVelocity.x += (targetCardPosition.x - cardPosition.x) * 0.075
        cardVelocity.y += (targetCardPosition.y - cardPosition.y) * 0.075
        cardVelocity.x *= 0.78
        cardVelocity.y *= 0.78
        cardPosition.x += cardVelocity.x
        cardPosition.y += cardVelocity.y
        card.position.x = cardPosition.x
        card.position.y = cardPosition.y + (reducedMotion ? 0 : Math.sin(seconds * 1.2) * 0.025)
        card.rotation.z = THREE.MathUtils.clamp(-cardVelocity.x * 1.8 + Math.sin(seconds * 0.65) * 0.025, -0.32, 0.32)
        card.rotation.x = THREE.MathUtils.clamp(pointer.y * -0.08 - cardVelocity.y * 0.8, -0.22, 0.22) + scrollProgress * 0.12
        card.rotation.y = THREE.MathUtils.clamp(pointer.x * 0.12 + cardVelocity.x * 0.7, -0.25, 0.25) + scrollProgress * 0.24
        ring.rotation.z = seconds * 0.08 + scrollProgress * Math.PI
        stars.rotation.y = seconds * 0.012
        card.updateMatrixWorld(true)
        updateStrap(0)
        updateStrap(1)

        if (photoMesh && profileMaterial && pointerInside) {
          raycaster.setFromCamera(new THREE.Vector2(pointerNdc.x, pointerNdc.y), camera)
          const hit = raycaster.intersectObject(photoMesh)[0]
          profileMaterial.uniforms.maskStrength.value +=
            ((hit ? 1 : 0) - profileMaterial.uniforms.maskStrength.value) * 0.14
          if (hit?.uv) profileMaterial.uniforms.cursorUv.value.copy(hit.uv)
        } else if (profileMaterial) {
          profileMaterial.uniforms.maskStrength.value *= 0.88
        }

        renderer.render(scene, camera)
        animationFrame = window.requestAnimationFrame(render)
      }

      render()
    })

    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      observer?.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointerup', finishDrag)
      host.removeEventListener('pointercancel', finishDrag)
      host.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', onScroll)
      if (renderer) {
        renderer.dispose()
        renderer.domElement.remove()
      }
      profileTexture?.dispose()
      overlayTexture?.dispose()
      scene?.traverse(object => {
        const resource = object as import('three').Object3D & {
          geometry?: import('three').BufferGeometry
          material?: import('three').Material | import('three').Material[]
        }
        resource.geometry?.dispose()
        if (Array.isArray(resource.material)) resource.material.forEach(item => item.dispose())
        else resource.material?.dispose()
      })
    }
  }, [reducedMotion])

  return <div ref={hostRef} className="three-avatar id-card-scene" aria-label="Interactive 3D ID card. Drag the card to swing it." role="img" />
}
