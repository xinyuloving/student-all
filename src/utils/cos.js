// import { reject, resolve } from 'core-js/fn/promise';
import COS from 'cos-js-sdk-v5';
import ci from '@/utils/CISDK'

// 配置存储桶密钥
const cos = new COS({
    // SecretId: 'AKIDIQIuFI4aolRqypPilX2GDtHOFo67rKWR',
    // SecretKey: 'f4C2buwiCPM2QXOyHI2VhbEafTzFDuJS',
    SecretId: 'AKIDYw5xZuylJbdOt74j8JEsFMCl35rMaWCb',
    SecretKey: 'A2e04rPjmY3HFwMVNyIMAizzjCOJxLSI'

});

const Buckets = (function () {
    if (process.env.NODE_ENV === 'development') {
        // 开发环境
        return [
            // 课件
            {
                Bucket: 'develop-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'develop-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'preannouncement') {
        // 预发布环境
        return [
            // 课件
            {
                Bucket: 'pre-release-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'pre-release-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'production') {
        // 生产环境
        return [
            // 课件
            {
                Bucket: 'release-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'release-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'ningxia') {
        // 宁夏环境
        return [
            // 课件
            {
                Bucket: 'ningxia-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'ningxia-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'testing') {
        // 测试环境
        return [
            // 课件
            {
                Bucket: 'test-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'test-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    }
})()


//   文件上传至存储桶 bucketObj存储桶配置对象 progressCb进度回调
export default {

    //获取url
    getObjectUrl(typeObj) {
        return new Promise((resolve, reject) => {
            cos.getObjectUrl({
                ...Buckets[typeObj.type],
                Key: typeObj.key,
                Sign: true, //是否返回带有签名的 Url，默认为 true
            }, (error, data) => {
                // console.log(error || data);
                if (!error) {
                    resolve(data)
                } else {
                    reject(error || data)
                }
            })
        })
    },


    // 获取文件
    getFile(typeObj) {
        // console.log(typeObj);
        return new Promise((resolve, reject) => {
            cos.getObject({
                ...Buckets[typeObj.type],
                Key: typeObj.key
            }, (error, data) => {
                if (!error && data.statusCode === 200) {
                    resolve(data.Body);
                } else {
                    reject(error || data)
                }
            })
        })
    },

    // 预览文档
    previewTheDocument(typeObj) {
        return new Promise(async (resolve, reject) => {
            try {
                const url = await ci.getPreviewUrl({
                    objectUrl: `${process.env.NODE_ENV === "ningxia" ? 'https' : 'http'}://${Buckets[typeObj.type].Bucket}.cos.${Buckets[typeObj.type].Region}.myqcloud.com/${typeObj.key}`,
                    credentials: {
                        SecretId: 'AKIDYw5xZuylJbdOt74j8JEsFMCl35rMaWCb',
                        SecretKey: 'A2e04rPjmY3HFwMVNyIMAizzjCOJxLSI'
                    }
                })
                resolve(url)
            } catch (err) {
                reject(err)
            }
        })
    }

}