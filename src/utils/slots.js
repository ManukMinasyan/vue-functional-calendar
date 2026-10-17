import { Comment, Fragment } from 'vue'

const flatten = vnodes =>
  vnodes.flatMap(vnode =>
    vnode.type === Fragment ? flatten(vnode.children) : [vnode]
  )

const vIfPlaceholders = ['v-if', '']

// Vue renders a false v-if as <!--v-if--> in dev and <!----> in production builds
const isHtmlComment = vnode =>
  vnode.type === Comment && !vIfPlaceholders.includes(vnode.children)

export const hasSlotContent = (slot, props = {}) => {
  if (!slot) return false

  const vnodes = flatten(slot(props))
  return !(vnodes.length && vnodes.every(isHtmlComment))
}

const INTERACTIVE_TAGS = ['button', 'input', 'select', 'textarea']

const isInteractive = vnode => {
  if (!vnode || typeof vnode !== 'object') return false

  const props = vnode.props || {}
  if (typeof vnode.type === 'string') {
    if (INTERACTIVE_TAGS.includes(vnode.type)) return true
    if (vnode.type === 'a' && props.href !== undefined) return true
    if (props.tabindex !== undefined || props.tabIndex !== undefined)
      return true
  }

  return Array.isArray(vnode.children) && vnode.children.some(isInteractive)
}

export const slotHasInteractiveContent = (slot, props = {}) =>
  !!slot && flatten(slot(props)).some(isInteractive)
