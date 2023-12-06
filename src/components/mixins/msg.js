import router from '@/router'
let msgTimer = null;
let msgTimer2 = null;
let msgDom = null;
let msgParentDom = null;
let notifyTimer, notifyTimer2, notifyDom;

export default {
    methods: {
        // 接收两个参数 content：内容    element：dom元素 默认插入到body可自定义
        _msg(content, element) {
            const DOM = element || document.body;
            const msg = getChildDom(content, 0);
            if (msgTimer && msgDom) {
                if (msgTimer2) clearTimeout(msgTimer2);
                clearTimeout(msgTimer);
                msgParentDom.removeChild(msgDom);
                msgDom = null;
                msgParentDom = null;
            }
            DOM.appendChild(msg);
            msgDom = msg;
            msgParentDom = DOM;
            enter_view(0)
            out_view(0)
        },
        _notify(content) {
            const DOM = document.body;
            const msg = getChildDom(content, 1);
            if (notifyTimer && notifyDom) {
                if (notifyTimer2) clearTimeout(notifyTimer2);
                clearTimeout(notifyTimer);
                DOM.removeChild(notifyDom);
                notifyDom = null;
            }
            DOM.appendChild(msg);
            msg.appendChild(getImgDom());
            msg.appendChild(getSpanDom());
            notifyDom = msg;
            msg.addEventListener('touchend', () => {
                clearTimeout(notifyTimer2);
                clearTimeout(notifyTimer);
                notifyDom.style.opacity = 0;
                notifyDom.style.top = '0%';
                const timer3 = setTimeout(() => {
                    document.body.removeChild(notifyDom);
                    notifyDom = null;
                    clearTimeout(timer3);
                    notifyTimer2 = null;
                    notifyTimer = null;
                }, 300);
                router.push({ name: 'Notification' })
            })
            enter_view(1);
            out_view(1);
        }
    }
}

function getChildDom(content, type) {
    const msg = document.createElement('div');
    if (type) {
        msg.style.display = 'flex',
        msg.style.alignItems = 'center';
        msg.style.width = '612px';
        msg.style.height = '82px';
        msg.style.padding = '0 37px';
        msg.style.background = '#fff';
        msg.style.borderRadius = '10px';
        msg.style.boxShadow = '0px 0px 12px 0px #D7DCDF';
        msg.style.fontSize = '22px';
        msg.style.top = '0%';
    } else {
        msg.style.background = 'rgba(0, 0, 0, .7)';
        msg.style.color = '#fff';
        msg.style.padding = '10px 20px';
        msg.style.borderRadius = '5px';
        msg.style.top = '40%';
        msg.innerText = content;
    }
    msg.style.transform = 'translate(-50%)';
    msg.style.left = '50%';
    msg.style.position = 'absolute';
    msg.style.zIndex = 8000;
    msg.style.opacity = 0;
    msg.style.transition = 'all .3s ease'
    return msg
}

function getImgDom() {
    const imgDom = document.createElement('img');
    imgDom.style.width = '104px';
    imgDom.style.height = '74px';
    imgDom.style.marginRight = '20px';
    imgDom.src = require('@/assets/img/remind.png');
    return imgDom
}

function getSpanDom() {
    const sp = document.createElement('span');
    sp.innerText = '小可爱，你有一条通知请及时查看哦';
    return sp
}

function enter_view(type) {
    const dom = type ? notifyDom : msgDom; 
    const location = type ? '10%' : '50%';
    let t = setTimeout(() => {
        dom.style.opacity = 1;
        dom.style.top = location;
        clearTimeout(t)
    }, 0);
}

function out_view(type, time) {
    if (type) {
        notifyTimer = setTimeout(() => {
            notifyDom.style.opacity = 0;
            notifyDom.style.top = '0%';
            notifyTimer2 = setTimeout(() => {
                document.body.removeChild(notifyDom);
                notifyDom = null;
                clearTimeout(notifyTimer2);
                clearTimeout(notifyTimer);
                notifyTimer2 = null;
                notifyTimer = null;
            }, 300);
        }, time || 5000);
    } else {
        msgTimer = setTimeout(() => {
            msgDom.style.opacity = 0;
            msgDom.style.top = '40%';
            msgTimer2 = setTimeout(() => {
                msgParentDom.removeChild(msgDom);
                msgDom = null;
                msgParentDom = null;
                clearTimeout(msgTimer2);
                clearTimeout(msgTimer);
                msgTimer2 = null;
                msgTimer = null;
            }, 300);
        }, time || 5000);
    }
}