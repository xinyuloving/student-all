// 工具库
const imEnv = process.env.NODE_ENV === "development" ? 'dev' : process.env.NODE_ENV === "testing" ? 'test' : '';
import _ from "lodash"
/**
 * @param {DOM} dom  要添加鼠标抬起事件的 DOM 元素
 * @param {time} duration  长按的时间， ms 为单位
 * @param {Function} moreThanFun  达到长按时间的处理函数
 * @param {Function} lastThanFun  未达到长按时间的处理函数
 */
function longPress(dom, duration, moreThanFun, lastThanFun) {
    // 长按函数
    const downTimeStamp = new Date().getTime();  // 按下的时间戳
    function handleFun() {
        const upTimeStamp = new Date().getTime();
        if ((upTimeStamp - downTimeStamp) > duration) {
            if (moreThanFun) moreThanFun();
            // 长按超过两秒的事件
        } else {
            // 长按不超过两秒的事件
            if (lastThanFun) {
                // 如果有这个事件就执行
                lastThanFun();
            }
        }
        dom.removeEventListener("touchend", handleFun, false);
    }
    dom.addEventListener("touchend", handleFun, false)
}

/**
 * 
 * @param {Object} dom 要运动的 DOM 元素
 * @param {Number} h 运动的距离
 * @param {Function} fun 运动完成之后的回调函数
 */
function startMove(dom, h, fun) {
    // 运动函数
    // console.log(h);
    clearInterval(dom.timer);
    // 快速开始，慢速结束，将整个移动的过程分成两个时间段，第一个时间段做加速，第二个时间段做减速。当 移动的距离等于 h 时停止
    let speed = 0; // 起始速度
    const g = 0.8;  // 加速度
    const t = parseInt(h / 2); // 临界值，用以控制速度

    let distance = 0; // 移动的距离
    dom.timer = setInterval(() => {
        if (distance < t) {
            // 加速度
            speed += g;
            distance += speed;
            dom.style.bottom = `${-distance}px`;
        }
        if (distance >= t && distance < h) {
            // 减速度
            if (speed > 0.8) {
                speed += g * -1;
            } else {
                speed = 0.8;
            }
            distance += speed;
            dom.style.bottom = `${-distance}px`;
        }
        if (distance >= h) {
            dom.style.bottom = `${-h}px`;
            clearInterval(dom.timer);
            if (fun) {
                // 动画执行结束
                fun();
            }
        }
    }, 30)
}

/**
 * 
 * @param {Array} arr  需要打乱的数组
 * @param {String} flag  遍历数组的键名
 * @param {Number} id  数组中每一个对象的唯一标识，通过它找到这个学生
 * @param {Boolean} order  将找到的这个对象元素，放到数组开头或是末尾（true表示末尾，false表示开头，默认放开头）
 * 
 */
function repaintArray(arr, flag, id, order) {
    // 重绘数组：将一个数组的顺序随机打乱重排。
    // 逻辑：在动画执行前，我们会拿到随机选中的学生id，在这个数组中把这个学生找出，并且将它从原数组中删除，之后将这个数组的顺序打乱，之后在我们找到的学生对象放到打乱数组的末尾，最后控制动画停到末尾。
    const copyArr = [...arr];
    const index = copyArr.findIndex(item => item[flag] === id);
    // let temArr; // 打乱的数组
    if (index !== -1) {
        let lastArr; // 最终的返回数组，动画需要：人数小于15将数组复制4遍..
        const target = copyArr.splice(index, 1)[0];
        // const targetObj = copyArr[index]; // 找到的对象元素
        // targetObj = copyArr.splice(index, 1)[0];
        // console.log(targetObj);
        // temArr = _.shuffle(copyArr);
        if (copyArr.length < 15) {
            lastArr = [...copyArr, ...copyArr, ...copyArr];
        } else if (copyArr.length < 30) {
            lastArr = [...copyArr, ...copyArr];
        } else {
            lastArr = copyArr;
        }

        const temArr = _.shuffle(lastArr);

        if (!order) {
            temArr.unshift(target);
        } else {
            temArr.push(target);
        }
        return { winnerInfo: target, options: temArr };
    } else {
        // temArr = copyArr;
        return { winnerInfo: {}, options: copyArr }
    }
}


/**
 * 防抖
 * @param {*} fn 防抖动的函数
 * @param {*} wait 等待的时间
 * @returns 
 */
function debounce(fn, wait) {
    let timer = null;
    return function () {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, wait);
    }
    // clearTimeout(timer);
    // timer = setTimeout(() => {
    //     fn();
    //     clearTimeout(timer);
    // }, wait);
}

/**
 * 根据文件后缀判断文件是那种类型
 * @param {String} suffix 文件后缀名
 * @returns 标识符：1 -->  图片； 2 --> 视频； 3 -->  各种可用 iframe 预览的 pdf
 */
function judgeFileSuffix(suffix) {
    const imgArr = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const video = ['AVI', 'mov', 'rmvb', 'rm', 'FLV', 'mp4', '3GP'];
    let flag;
    if (imgArr.includes(suffix)) {
        flag = 1;
    } else if (video.includes(suffix)) {
        flag = 2;
    } else {
        flag = 3;
    }
    return flag;
}

function changeStatusBar(flag) {
    if (flag) {
        window?.WebViewJavascript?.showStatusBar();
    } else {
        window?.WebViewJavascript?.hideStatusBar();
    }
}


/**
 * 
 * @param {HTMLElement} currentDom 当前需要插入的DOM元素
 * @param {HTMLElement} targetDom 插入到的目标元素，默认body
 * @param {Boolean} type 插入或移除，默认插入
 */
function insertDom(currentDom, targetDom = document.body, type = true) {
    if (type) {
        if (targetDom.append) {
            targetDom.append(currentDom);
        } else {
            targetDom.appendChild(currentDom);
        }
    } else {
        targetDom.removeChild(currentDom);
    }
}


// 指定范围的随机数
function rnd(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
}

function createStudentIM(studentId) {
    return `${imEnv}1000${studentId}`
}

export {
    longPress,
    startMove,
    repaintArray,
    debounce,
    judgeFileSuffix,
    changeStatusBar,
    insertDom,
    rnd,
    createStudentIM
}