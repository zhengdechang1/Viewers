/*
 * @Description: 
 * @Author: Deven
 * @Date: 2022-11-24 17:10:32
 */

class ReplaceStr {
    constructor(serve) {
        // this.serve = this.serveAddStr(serve);
        this.serve = this.serveAddStrOrthanc(serve);
        this.ipServe = this.serveDeleteStr(this.serveAddStr(serve))
        // this.devServe = this.serveAddStr(serve)
        this.devServe = this.serveAddStrOrthanc(serve)
        this.ip = this.serveDeleteStr(this.serveAddStr(serve)).wadoRoot
    }


    serveAddStr = function (serve) {
        console.log('serve: ', serve);

        if (!serve) return {}

        if (typeof (serve) == 'string') {
            serve = {
                wadoUriRoot: serve,
                qidoRoot: serve,
                wadoRoot: serve,
            }
        }

        serve = {
            qidoRoot: serve.qidoRoot,
            wadoRoot: serve.qidoRoot,
            wadoUriRoot: serve.qidoRoot,
        }
        let res = {}
        for (let item in serve) {
            let isInclude = serve[item].includes('http') || serve[item].includes('https')
            if (!isInclude) {
                res[item] = item.includes('wadoUri') ? `http://${serve[item]}:8042/wado` : `http://${serve[item]}:8042/dicom-web`
                continue;
            }
            res[item] = serve[item]
        }
        return res
    }

    serveAddStrOrthanc = function (serve) {
        console.log('serve: ', serve);

        if (!serve) return {}

        if (typeof (serve) == 'string') {
            serve = {
                wadoUriRoot: serve,
                qidoRoot: serve,
                wadoRoot: serve,
            }
        }

        serve = {
            qidoRoot: serve.qidoRoot,
            wadoRoot: serve.qidoRoot,
            wadoUriRoot: serve.qidoRoot,
        }
        let res = {}
        for (let item in serve) {
            let isInclude = serve[item].includes('http') || serve[item].includes('https')
            if (!isInclude) {
                res[item] = item.includes('wadoUri') ? `http://${serve[item]}:2099/orthanc/wado` : `http://${serve[item]}:2099/orthanc/dicom-web`
                continue;
            }
            res[item] = serve[item]
        }
        return res
    }
    serveAddStrDev = function (serve) {

        if (!serve) return {}

        if (typeof (serve) == 'string') {
            serve = {
                wadoUriRoot: serve,
                qidoRoot: serve,
                wadoRoot: serve,
            }
        }

        serve = {
            qidoRoot: serve.qidoRoot,
            wadoRoot: serve.qidoRoot,
            wadoUriRoot: serve.qidoRoot,
        }
        let res = {}
        for (let item in serve) {
            let isInclude = serve[item].includes('http') || serve[item].includes('https')
            if (!isInclude) {
                res[item] = item.includes('wadoUri') ? `http://${serve[item]}:8041/wado` : `http://${serve[item]}:8041/dicom-web`
                continue;
            }
            res[item] = serve[item]
        }
        return res
    }

    serveDeleteStr = function (serve) {
        if (!serve) return {}
        let res = {}
        let reg_str = /\d+\.\d+\.\d+\.\d+/
        for (let item in serve) {
            res[item] = serve[item].match(reg_str)?.[0]
        }
        return res
    }

    getDevServe = function (serve) {
        if (!serve) return {}
        let res = {}
        for (let item in serve) {
            res[item] = serve[item].includes('http') ? serve[item].replace('http://', '/') : serve[item].replace('https://', '/')
        }
        return res
    }

}


export default ReplaceStr