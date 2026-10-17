import { Component, PluginObject } from 'vue'

export declare const FunctionalCalendar: Component

declare const FunctionalCalendarPlugin: Component &
  PluginObject<Record<string, unknown>> & {
    FunctionalCalendar: Component
  }

export default FunctionalCalendarPlugin
