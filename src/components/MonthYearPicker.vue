<template>
    <div class="vfc-months-container">
        <div class="vfc-content">
            <div class="vfc-navigation-buttons">
                <div @click="$parent.PreYear(calendarKey)">
                    <div class="vfc-arrow-left"></div>
                </div>
                <h2 class="vfc-top-date">
                    <span class="vfc-popover-caret"></span>
                    {{ $parent.listCalendars[calendarKey].date.getFullYear() }}
                </h2>
                <div @click="$parent.NextYear(calendarKey)">
                    <div class="vfc-arrow-right"></div>
                </div>
            </div>
            <div class="vfc-months">
                <template v-if="$parent.showMonthPicker">
                    <div class="vfc-item" v-for="(month,key) in $parent.fConfigs.shortMonthNames"
                         :key="key"
                         :class="{'vfc-selected': $parent.listCalendars[calendarKey].date.getMonth()===key}"
                         @click="$parent.pickMonth(calendarKey, key)">
                        {{ month }}
                    </div>
                </template>
                <template v-else-if="$parent.showYearPicker">
                    <div class="vfc-item"
                         v-for="(year,key) in $parent.yearList"
                         :key="key"
                         :class="{'vfc-selected': $parent.listCalendars[calendarKey].date.getFullYear()===year.year}"
                         @click="$parent.pickYear(calendarKey, year.year)">
                        {{ year.year }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MonthYearPicker",
        props: {
            calendarKey: 0
        }
    }
</script>

<style scoped>

</style>
