/**
 * @param {string} s
 * @return {string}
 */
const longestPalindrome = function (s) {
  let res = ""
  let len = s.length
  if (len < 2) return s
  let maxLen = 1
  let begin = 0
  // 创建二维数组
  let dp = Array.from(new Array(len), () => new Array(len).fill(false))
  // 先将对角线的值初始化填为true
  for (let i = 0; i < len; i++) {
    dp[i][i] = true
  }
  // 状态 dp[i][j] 表示子串s[i...j]是否是回文子串
  // 先计算左下方的值
  for (let j = 1; j < len; j++) {
    for (let i = 0; i < j; i++) {
      if (s[i] !== s[j]) {
        dp[i][j] = false
      } else if (j - i < 3) {
        // 头尾去掉没有字符和剩下一个字符的时候 一定是回文子串
        dp[i][j] = true
      } else {
        // 如果都不是，则需要看左下角的状态
        dp[i][j] = dp[i + 1][j - 1]
      }
      if (dp[i][j] && j - i + 1 > maxLen) {
        maxLen = j - i + 1
        begin = i
      }
    }
  }
  return s.substring(begin, begin + maxLen)
}
console.log(longestPalindrome("babad"))
