// 文件格式

// 视频格式
function videoFormat() {
    return '.mp4,.mkv'
}

// 图片格式
function imageFormat() {
    return '.bmp,.jpg,.jpeg,.jfif,.png,.webp'
}

// 音频格式
function audioFormat() {
    return '.mp3,.aac'
}

// word文件格式
function wordFormat() {
    return '.doc,.docx,.docm'
}

// excel文件格式
function excelFormat() {
    return '.xls,.xlsx,.xlsb,.xlsm,.xlst'
}

export {
    videoFormat,
    imageFormat,
    audioFormat,
    wordFormat,
    excelFormat
}