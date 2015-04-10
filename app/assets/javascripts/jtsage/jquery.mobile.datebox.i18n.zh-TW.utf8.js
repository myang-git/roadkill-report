/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-datebox
 *
 * Translation by: Ethan Chen <ethan42411@gmail.com>, michelle4233536 <crowdin>
 *
 */

jQuery.extend(jQuery.mobile.datebox.prototype.options.lang, {
	'zh-TW': {
		setDateButtonLabel: "設定日期",
		setTimeButtonLabel: "設定時間",
		setDurationButtonLabel: "設定持續日期",
		calTodayButtonLabel: "選擇今天日期",
		titleDateDialogLabel: "選擇日期",
		titleTimeDialogLabel: "選擇時間",
		daysOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		daysOfWeekShort: ["日", "一", "二", "三", "四", "五", "六"],
		monthsOfYear: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsOfYearShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
		durationLabel: ["天", "小時", "分鐘", "秒"],
		durationDays: ["天", "天"],
		tooltip: "開啟日期選擇",
		nextMonth: "下個月",
		prevMonth: "上個月",
		timeFormat: 24,
		headerFormat: '%A, %B %-d, %Y',
		dateFieldOrder: ['m', 'd', 'y'],
		timeFieldOrder: ['h', 'i', 'a'],
		slideFieldOrder: ['y', 'm', 'd'],
		dateFormat: "%Y-%m-%d",
		useArabicIndic: false,
		isRTL: false,
		calStartDay: 0,
		clearButton: "清除",
		durationOrder: ['d', 'h', 'i', 's'],
		meridiem: ["上午", "下午"],
		timeOutput: "%k:%M",
		durationFormat: "%Dd %DA, %Dl:%DM:%DS",
		calDateListLabel: "其他日期",
		calHeaderFormat: "%B %Y",
		calTomorrowButtonLabel: "跳轉到明天"
	}
});
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
	useLang: 'zh-TW'
});

