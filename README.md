zCalendar
=========

jQuery plugin 

 Show calendar and return selected date/period.


<!--组件默认一直呈显示状态-->
<!--通过某种方式选择年、月，选择了年月后，日期列表做相应切换-->
<!--通过单击某个具体的日期进行日期选择-->
<!--组件初始化时，可配置可选日期的上下限。可选日期和不可选日期需要有样式上的区别-->
<!--提供设定日期的接口，指定具体日期，日历面板相应日期选中-->
<!--提供获取日期的接口，获取日历面板中当前选中的日期，返回一个日期对象（或其他形式，自定）-->

<!--日期选择面板默认隐藏，会显示一个日期显示框和一个按钮，点击这两个部分，会浮出日历面板。再点击则隐藏。-->
<!--点击选择具体日期后，面板隐藏，日期显示框中显示选取的日期-->
<!--增加一个接口，用于当用户选择日期后的回调处理-->


<!--增加一个参数及相应接口方法，来决定这个日历组件是选择具体某天日期，还是选择一个时间段-->
<!--当设置为选择时间段时，需要在日历面板上点击两个日期来完成一次选择，两个日期中，较早的为起始时间，较晚的为结束时间，选择的时间段用特殊样式标示-->
<!--增加参数及响应接口方法，允许设置时间段选择的最小或最大跨度，并提供当不满足跨度设置时的默认处理及回调函数接口-->
<!--在弹出的日期段选择面板中增加确认和取消按钮-->


<!--1. mode: day/month/year-->
<!--2. show: 始终显示/多一个input和button,点击button显示-->
<!--3. 选择日期是否为多选的接口: 选择点个日期/选择一个时间段-->
<!--4. 添加事件, onSelectDate onSelectPeriod 返回选择的日期-->
<!--5. startDate/endDate: 初始化时,配置可选日期的上下限-->
<!--6. selectedDate: 初始化时设置已选中日期-->
<!--7. setSelectedDate: 调用方法设置选中日期-->
<!--8. getSelectedDate: 调用方法获取选中日期-->


<!--setting:-->

<!--mode: day/month/year || day-->
<!--startDate: date || null-->
<!--endDate: date || null-->
<!--selectedDate: date-->

<!--events-->
<!--onSelect-->
<!--onClick-->
<!--onShow-->
<!--onHide-->
