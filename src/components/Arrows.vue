<template>
    <div>
        <div
            class="vfc-separately-navigation-buttons"
            :class="'vfc-' + fConfigs.arrowsPosition"
            v-if="!fConfigs.isSeparately && !isMultiple"
        >
            <div
                @click="$parent.PreMonth(0)"
                :class="{ 'vfc-cursor-pointer': allowPreDate }"
            >
                <slot name="navigationArrowLeft">
                    <div
                        class="vfc-arrow-left"
                        :class="{ 'vfc-disabled': !allowPreDate }"
                    ></div>
                </slot>
            </div>
            <div
                @click="$parent.NextMonth(0)"
                :class="{ 'vfc-cursor-pointer': allowNextDate }"
            >
                <slot name="navigationArrowRight">
                    <div
                        class="vfc-arrow-right"
                        :class="{ 'vfc-disabled': !allowNextDate }"
                    ></div>
                </slot>
            </div>
        </div>
        <div
            v-if="fConfigs.isSeparately && isMultiple"
            class="vfc-separately-navigation-buttons"
            :class="'vfc-' + fConfigs.arrowsPosition"
        >
            <div
                @click="$parent.PreMonth(key)"
                :class="{
                    'vfc-cursor-pointer': allowPreDate,
                }"
            >
                <slot name="navigationArrowLeft">
                    <div
                        class="vfc-arrow-left"
                        :class="{
                            'vfc-disabled': !allowPreDate,
                        }"
                    ></div>
                </slot>
            </div>
            <div
                @click="$parent.NextMonth(calendarKey)"
                :class="{
                    'vfc-cursor-pointer': allowNextDate,
                }"
            >
                <slot name="navigationArrowRight">
                    <div
                        class="vfc-arrow-right"
                        :class="{
                            'vfc-disabled': !allowNextDate,
                        }"
                    ></div>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Arrows",
    props: {
        fConfigs: {
            type: Object,
            required: true,
        },
        allowPreDate: {
            type: Boolean,
            required: true,
        },
        allowNextDate: {
            type: Boolean,
            required: true,
        },
        calendarKey: {
            type: Number,
            default: -1,
        },
        isMultiple: {
            type: Boolean,
            required: true,
        },
    },
}
</script>

<style scoped></style>
