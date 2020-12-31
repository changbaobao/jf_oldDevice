var timer = {};
timer.timeout = {};
timer.interval = {};
/**
 * clear all timeout
 * 清除所有的timeout
 */
function cat () {
  for (var key in timer.timeout) {
    clearTimeout(timer.timeout[key]);
    delete timer.timeout[key];
  }
};
/**
 * clear all Interval
 * 清除所有的Interval
 */
function cai () {
  for (var key in timer.interval) {
    //此处添加清除方法;
    delete timer.interval[key];
  }
};
/**
 * 清除所有定时器
 * setTimeOut 与 setInterval
 */
function ca () {
  timer.cat();
  timer.cai();
};
/**
 * clear timeout by id
 * 根据id清除某个timeout
 * @param id
 */
function ctbi  (id) {
  if(timer.timeout[id]){
    clearTimeout(timer.timeout[id]);
    delete timer.timeout[id];
  }
};

/**
 * add timeout
 * 新增 timeout
 * @param id id
 * @param obj 函数
 * @param time 时间
 */
function at (id,obj,time) {
  if(timer.timeout[id]){
    clearTimeout(timer.timeout[id]);
  }
  timer.timeout[id] = setTimeout(obj,time);
}

export default {
  at, ctbi, ca, cai, cat
}
