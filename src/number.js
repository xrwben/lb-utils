// 金额转换成千分位格式展示
export const formatThousandStyle = (val = 0) => {
    let split_amount = (val + '').split('.'),
        // 将传入金额转换为字符串并以小数点作为分割
        formats = [split_amount[0]].map((item) => {
            // 对整数部分进行千分位格式化
            let reg = /\d{1,3}(?=(\d{3})+$)/g
            return item.replace(reg, '$&,')
        })
    // 拼接小数部分
    return formats + (split_amount[1] != undefined ? '.' + split_amount[1] : '')
}
