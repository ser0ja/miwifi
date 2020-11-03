// import cn from './languages/cn.js'
// import ru from './languages/ru.js'

/*
const arrayUnique = (array) => {
    const a = array.concat()
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1)
            }
        }
    }
    return a
}
*/

// https://www.javascriptcookbook.com/article/traversing-dom-subtrees-with-a-recursive-walk-the-dom-function/
function walk(node, callback) {
    if (callback(node) === false) return false
    node = node.firstChild
    while (node != null) {
        if (walk(node, callback) === false) return false
        node = node.nextSibling
    }
}

const replacer = (str) => {
    cn.indexOf(str) === -1 ? console.log(str, cn.indexOf(str)) : null
    return cn.indexOf(str) === -1 ? str : `${ru[cn.indexOf(str)]}`
}

const parse = (target) => {
    // CJK Unified Ideographs                   4E00-62FF, 6300-77FF, 7800-8CFF, 8D00-9FFF
    // CJK Unified Ideographs Extension A       3400-4DBF
    // CJK Unified Ideographs Extension B       20000-215FF, 21600-230FF, 23100-245FF, 24600-260FF, 26100-275FF, 27600-290FF, 29100-2A6DF
    // CJK Unified Ideographs Extension C       2A700-2B73F
    // CJK Unified Ideographs Extension D       2B740–2B81F
    // CJK Unified Ideographs Extension E       2B820–2CEAF
    // CJK Unified Ideographs Extension F       2CEB0–2EBEF
    // CJK Unified Ideographs Extension G       30000–3134F
    // CJK Compatibility Ideographs             F900–FAFF
    // CJK Symbols and Punctuation              3000–303F
    // CJK Compatibility                        3300–33FF
    // CJK Compatibility Forms                  FE30–FE4F
    // CJK Compatibility Ideographs             F900–FAFF
    // CJK Compatibility Ideographs Supplement  2F800–2FA1F

    const regexParts = [
        /[\u4E00-\u62FF]|[\u6300-\u77FF]|[\u7800-\u8CFF]|[\u8D00-\u9FFF]/
        // /[\u3400-\u4DBF]/,
        // /[\u20000-\u215FF\u21600-\u230FF\u23100-\u245FF\u24600-\u260FF\u26100-\u275FF\u27600-\u290FF\u29100-\u2A6DF]/,
        // /[\u2A700-\u2B73F]/,
        // /[\u2B740–\u2B81F]/,
        // /[\u2B820–\u2CEAF]/,
        // /[\u2CEB0–\u2EBEF]/,
        // /[\u30000–\u3134F]/,
        // /[\uF900–\uFAFF]/,
        // /[\u3000–\u303F]/
        // /[\u3300–\u33FF]/,
        // /[\uFE30–\uFE4F]/,
        // /[\uF900–\uFAFF]/,
        // /[\u2F800–\u2FA1F]/
    ]
    const regexString = regexParts.map((x) => x.source).join('|')
    const reg = new RegExp(`(${regexString})+`, 'gu')

    const newLines = document.documentElement.textContent.match(reg)
    console.log(newLines)
    // const oldLines = localStorage.getItem('lines')
    // if (oldLines === undefined || oldLines === null) {
    //    localStorage.setItem('lines', JSON.stringify(newLines))
    // } else {
    //     const parseLines = JSON.parse(oldLines)
    //     // const lines = parseLines?.length > 0 ? parseLines.concat(newLines.filter((item) => parseLines.indexOf(item) === -1)) : []
    //     const lines = parseLines?.length > 0 ? arrayUnique(parseLines.concat(newLines)) : []
    //     localStorage.setItem('lines', JSON.stringify(lines))
    // }

    walk(target, (node) => {
        if (node?.nodeType) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const placeholder = node?.getAttribute('placeholder')?.trim() ?? null
                if (placeholder) {
                    node?.setAttribute('placeholder', placeholder.replace(reg, replacer))
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                const text = node.data.trim()
                if (text.length > 0) {
                    node.nodeValue = text.replace(reg, replacer)
                }
            }
        }
    })
}

const observer = new window.MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
        if (mutation?.target && mutation.type === 'childList') {
            parse(mutation.target)
        }
    }
})

// const onlyUnique = (value, index, self) => self.indexOf(value) === index
// const unique = strings.main.filter(onlyUnique)
// console.log(unique)

// const reg = /([\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])+/gu
// const text0 = document.documentElement.innerHTML.match(/>([\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]+)</gu)
// const text = document.documentElement.innerText.match(reg)
// console.log(text)

// const toUnicode = (str) => {
//     return str.split('').map(function (value, index, array) {
//         const temp = value.charCodeAt(0).toString(16).padStart(4, '0')
//         if (temp.length > 2) {
//             return '\\u' + temp
//         }
//         return value
//     }).join('')
// }

// hashchange popstate readystatechange
window.addEventListener('load', (e) => {
    // console.log('onload', e)
    const body = document?.getElementsByTagName('body')[0] ?? null
    if (body) {
        parse(body)
    }
}, false)

const body = document?.getElementsByTagName('body')[0] ?? null
if (body) {
    observer.observe(body, {
        subtree: true,
        childList: true
    })
}
