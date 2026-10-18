import { Comment, Fragment, renderSlot } from 'vue'

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

export const SlotOutlet = (props, { slots }) =>
  renderSlot({ default: props.source }, 'default', props.scope, slots.default)
SlotOutlet.props = ['source', 'scope']

const FOCUSABLE =
  'button, input, select, textarea, a[href], [tabindex], [contenteditable]'

export const containsFocusable = element =>
  !!element && !!element.querySelector(FOCUSABLE)
