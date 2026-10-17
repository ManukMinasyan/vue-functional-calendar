<template>
  <div>
    <div
      class="vfc-separately-navigation-buttons"
      :class="'vfc-' + fConfigs.arrowsPosition"
      v-if="oneArrows || manyArrows"
    >
      <component
        ref="navigationArrowLeft"
        :is="usesButton('navigationArrowLeft') ? 'button' : 'div'"
        v-bind="
          controlAttrs(
            'navigationArrowLeft',
            fConfigs.labels.previousMonth,
            !allowPreDate,
            `arrow-prev:${calendarKey}`
          )
        "
        :class="{ 'vfc-cursor-pointer': allowPreDate }"
        @click="calendarRoot.PreMonth(oneArrows ? 0 : calendarKey)"
        @keydown="onKeydown($event, 'navigationArrowLeft', 'PreMonth')"
      >
        <slot name="navigationArrowLeft">
          <div
            class="vfc-arrow-left"
            :class="{ 'vfc-disabled': !allowPreDate }"
          ></div>
        </slot>
      </component>
      <component
        ref="navigationArrowRight"
        :is="usesButton('navigationArrowRight') ? 'button' : 'div'"
        v-bind="
          controlAttrs(
            'navigationArrowRight',
            fConfigs.labels.nextMonth,
            !allowNextDate,
            `arrow-next:${calendarKey}`
          )
        "
        :class="{ 'vfc-cursor-pointer': allowNextDate }"
        @click="calendarRoot.NextMonth(oneArrows ? 0 : calendarKey)"
        @keydown="onKeydown($event, 'navigationArrowRight', 'NextMonth')"
      >
        <slot name="navigationArrowRight">
          <div
            class="vfc-arrow-right"
            :class="{ 'vfc-disabled': !allowNextDate }"
          ></div>
        </slot>
      </component>
    </div>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'
import { hasSlotContent, containsFocusable } from '../utils/slots'

export default {
  name: 'Arrows',
  inject: { calendarRoot: CALENDAR_KEY },
  props: {
    fConfigs: {
      type: Object,
      required: true
    },
    allowPreDate: {
      type: Boolean,
      required: true
    },
    allowNextDate: {
      type: Boolean,
      required: true
    },
    calendarKey: {
      type: Number,
      default: 0
    },
    isMultiple: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      focusOwners: {}
    }
  },
  computed: {
    oneArrows() {
      return !this.fConfigs.isSeparately && !this.isMultiple
    },
    manyArrows() {
      return this.fConfigs.isSeparately && this.isMultiple
    }
  },
  mounted() {
    this.detectFocusOwners()
  },
  updated() {
    this.detectFocusOwners()
  },
  methods: {
    detectFocusOwners() {
      const names = ['navigationArrowLeft', 'navigationArrowRight']
      const owners = Object.fromEntries(
        names.map(name => [
          name,
          !this.usesButton(name) && containsFocusable(this.$refs[name])
        ])
      )

      if (names.some(name => owners[name] !== !!this.focusOwners[name])) {
        this.focusOwners = owners
      }
    },
    usesButton(name) {
      return !hasSlotContent(this.calendarRoot.$slots[name])
    },
    onKeydown(event, name, method) {
      if (this.usesButton(name) || this.ownsFocus(name)) return
      if (event.key !== 'Enter' && event.key !== ' ') return

      event.preventDefault()
      this.calendarRoot[method](this.oneArrows ? 0 : this.calendarKey)
    },
    ownsFocus(name) {
      return !!this.focusOwners[name]
    },
    controlAttrs(name, label, disabled, focusId) {
      if (this.usesButton(name)) {
        return {
          type: 'button',
          'aria-label': label,
          'aria-disabled': disabled,
          'data-focus-id': focusId
        }
      }
      if (this.ownsFocus(name)) return {}

      return {
        role: 'button',
        tabindex: 0,
        'aria-label': label,
        'aria-disabled': disabled,
        'data-focus-id': focusId
      }
    }
  }
}
</script>
