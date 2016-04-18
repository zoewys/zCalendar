/**
 * Created by zoe on 4/16/16.
 */

if (typeof jQuery === "undefined") { throw new Error("Requires jQuery") }

(function($){

    var settings = {};
    var modeParams = {};
    var zCalendarContainer;

    var tools = {
        findDay:function(start,days){
            var time = start.getTime() + days*24*3600*1000;
            return new Date(time);
        },
        getNextMonth:function(date){
            var nextMonth;
            if (date.getMonth() == 11) {
                nextMonth = new Date(date.getFullYear() + 1, 0, 1);
            } else {
                nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            }
            return nextMonth;
        },
        getPrevMonth:function(date){
            var prevMonth;
            if (date.getMonth() == 0) {
                prevMonth = new Date(date.getFullYear() - 1, 11, 1);
            } else {
                prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            }
            return prevMonth;
        },
        findYear:function(date,years){
            return new Date(date.getFullYear()+years,date.getMonth(),date.getDate());
        },
        getFirstDateInMonth:function(date){
            return new Date(date.getFullYear()+'-'+(date.getMonth()+1));
        },
        getFirstMonthInYear:function(date){
            return new Date(date.getFullYear());
        }
    };

    var _consts = {
        emptyFn:function(){},
        containerCls:'zCalendar',
        disableCls:'disable',
        activeCls:'active',
        tr:'<tr>',
        th:'<th>',
        td:'<td>',
        thead:'<thead>',
        tbody:'<tbody>',
        table:'<table>',
        button:'<button>',
        div:'<div>',
        month:['January','February','March','April', 'May','June', 'July','August','September','October','November','December'],
        week:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        leftText:' < ',
        rightText:' > ',
        clickAttr:'data-zc-method',
        dayMode:'day',
        monthMode:'month',
        yearMode:'year'
    };

    // click event trigger list
    var _clickEventList = {

        'nextclick':function(){
            var nextDate = modeParams[settings.mode].getNextDate(settings.date);
            setDate(nextDate);
        },
        'prevclick':function(){
            var prevDate = modeParams[settings.mode].getPrevDate(settings.date);
            setDate(prevDate);
        },
        'tomonthclick':function(){
            setMode(_consts.monthMode);
        },
        'toyearclick':function(){
            setMode(_consts.yearMode);
        },

        'dateselect':function(e){
            var activeItem = $('['+_consts.clickAttr+'].active');
            if(activeItem){
                activeItem.removeClass(_consts.activeCls)
            }
            var clickEl = $(e.target);
            clickEl.addClass(_consts.activeCls);

            settings.selectedDate = clickEl.data('date');
            settings.listeners.onSelected.call(clickEl,clickEl.data('date'));
        },
        'monthselect':function(e){
            var $item = $(e.target);
            var date = $item.data('date');
            setDate(date,_consts.dayMode);
        },
        'yearselect':function(e){
            var $item = $(e.target);
            var date = $item.data('date');
            setDate(date,_consts.monthMode);
        }
    };

    var initModeParams = function(modeParams){
        
        modeParams[_consts.dayMode] = {
            column:7,
            row:6,
            cell:42,
            headColspan:5,
            headTitleEvent:'tomonthclick',
            tdClick:'dateselect',
            getHeadTitle:function(date){
                return _consts.month[date.getMonth()]+' '+date.getFullYear();
            },
            getShowData:function(date){
                var maxDate = settings.maxDate;
                var minDate = settings.minDate;

                var firstDate = tools.getFirstDateInMonth(date);
                var data = [];
                var start = firstDate.getDay();
                var cellDate = tools.findDay(firstDate,-start);
                for(var i=0;i<this.cell;i++){
                    var cellObj = {
                        text:cellDate.getDate(),
                        date:cellDate
                    };
                    if(cellDate.getMonth()!== firstDate.getMonth()){
                        cellObj['disable'] = true;
                    }
                    if(settings.selectedDate && cellDate.getTime() == settings.selectedDate.getTime()){
                        cellObj['active'] = true;
                    }
                    if(maxDate && cellDate.getTime()> maxDate){
                        cellObj['disable'] = true;
                    }
                    if(minDate && cellDate.getTime()<minDate){
                        cellObj['disable'] = true;
                    }
                    data.push(cellObj);
                    cellDate = tools.findDay(cellDate,1);
                }
                return data;
            },
            getNextDate:function(date){
                return tools.getNextMonth(date);
            },
            getPrevDate:function(date){
                return tools.getPrevMonth(date);
            }
        };
        
        modeParams[_consts.monthMode] = {
            column:3,
            row:4,
            cell:12,
            headColspan:1,
            headTitleEvent:'toyearclick',
            tdClick:'monthselect',
            getHeadTitle:function(date){
                return date.getFullYear();
            },
            getShowData:function(date){
                var year = date.getFullYear();
                var data = [];
                for(var i =0;i<this.cell;i++){
                    var monthDate = new Date(year+'-'+(i+1));
                    var cellObj = {
                        text:_consts.month[monthDate.getMonth()],
                        date:monthDate
                    };
                    if(date.getMonth()== monthDate.getMonth()){
                        cellObj['active'] = true;
                    }
                    data.push(cellObj);
                }
                return data;
            },
            getNextDate:function(date){
                return tools.findYear(date,1);
            },
            getPrevDate:function(date){
                return tools.findYear(date,-1)
            }
        };

        modeParams[_consts.yearMode]={
                column:5,
                row:4,
                cell:20,
                headColspan:3,
                tdClick:'yearselect',
                getHeadTitle:function(date){
                var firstYear = parseInt(date.getFullYear()/20)*20+1;
                var lastYear = firstYear + 20;
                return firstYear+' -- '+lastYear;
            },
            getShowData:function(date){
                var year = date.getFullYear();
                var cellYear = parseInt(year/20)*20;
                var data = [];
                for(var i=0;i<this.cell;i++){
                    cellYear = cellYear+1;
                    var cellObj = {
                        text: cellYear,
                        date:new Date(cellYear.toString())
                    };
                    if(cellYear == year){
                        cellObj['active'] = true;
                    }
                    data.push(cellObj);
                }
                return data;
            },
            getNextDate:function(date){
                return tools.findYear(date,this.cell);
            },
            getPrevDate:function(date){
                return tools.findYear(date,-this.cell)
            }
        }
    };


    var renderTable = function(){
        var date = settings.date;
        var modeObj = modeParams[settings.mode];


        var headEl = function(){

            var leftTh = $(_consts.th)
                .text(_consts.leftText).attr(_consts.clickAttr,'prevclick');

            var middleTh = $(_consts.th).attr('colspan',modeObj.headColspan)
                .text(modeObj.getHeadTitle(date));
            modeObj.headTitleEvent && middleTh.attr(_consts.clickAttr,modeObj.headTitleEvent);

            var rightTh = $(_consts.th)
                .text(_consts.rightText).attr(_consts.clickAttr,'nextclick');

            var tr = $(_consts.tr)
                .append(leftTh)
                .append(middleTh)
                .append(rightTh);

            return $(_consts.thead).append(tr);
        };

        var bodyEl = function(){
            var data = modeObj.getShowData(date);
            var tbody = $(_consts.tbody);
            var cell = 0;
            for(var row=0;row<modeObj.row;row++){
                var tr = $(_consts.tr);
                for(var column=0;column<modeObj.column;column++){
                    var td = $(_consts.td)
                        .text(data[cell].text)
                        .attr(_consts.clickAttr,modeObj.tdClick)
                        .data('date',data[cell].date);

                    data[cell].disable && td.addClass(_consts.disableCls);
                    data[cell].active && td.addClass(_consts.activeCls);
                    tr.append(td);
                    cell++;
                }
                tbody.append(tr);
            }
            return tbody;
        };


        var tableEl = $(_consts.table)
            .append(headEl())
            .append(bodyEl());


        var tableContainer;
        if(settings.autoShow){
            tableContainer = $(_consts.div).addClass(_consts.containerCls)
                .append(tableEl);
        }else{
            // include button and input
            // click button to show calendar
            // change input value after select date
        }

        tableContainer.on('click',function(e){
            var eventName = e.target.getAttribute(_consts.clickAttr);

            if(_clickEventList[eventName]){
                _clickEventList[eventName].apply(this,arguments);
            }
        });


        zCalendarContainer.html(tableContainer);
    };

    var setDate = function(date,mode){
        settings.date = date;
        mode && (settings.mode = mode);
        renderTable();
    };

    var setMode = function(mode){
        settings.mode = mode;

        renderTable();
    };

    var _init = function(){
        // var data = getFormatData();
        initModeParams(modeParams);
        renderTable();
    };


    $.fn.zCalendar = function(options){

        zCalendarContainer = this;
        
        settings = $.extend({

            autoShow:true,
            // day/month/year
            mode:'day' ,

            date:new Date(),

            maxDate:null,

            minDate:null,

            selectedDate:null,

            selectedStart:null,

            selectedEnd:null,

            periodSelect:false,

            listeners:{
                onSelected: _consts.emptyFn,
                onShow:_consts.emptyFn,
                onHide:_consts.emptyFn,
                onModeChange:_consts.emptyFn
            }
        },options);

        _init();

        var exports = {

            settings:settings,

            getSelectedDate:function(){
                return settings.selectedDate;
            },
            setSelectedDate:function(date){
                settings.selectedDate = date;
                setDate(date);
            }

            // setDate:setDate
        };

        return exports;
    };

})(jQuery);

