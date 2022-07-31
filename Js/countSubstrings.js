/**
 * 力扣 647 回文子串
 * 题目描述：
 * 给你一个字符串 s ，请你统计并返回这个字符串中 回文子串 的数目。
 * 回文字符串 是正着读和倒过来读一样的字符串。
 * 子字符串 是字符串中的由连续字符组成的一个序列
 * 具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。
 *
 * @param {string} s
 * @return {number}
 */
const countSubstrings = function (s) {
  let len = s.length
  let res = 0 // 结果
  let dp = Array.from(new Array(len), () => new Array(len).fill(false))
  for (let i = 0; i < len; i++) {
    dp[i][i] = true
    res += 1
  }
  for (let j = 1; j < len; j++) {
    for (let i = 0; i < j; i++) {
      if (s[i] !== s[j]) {
        dp[i][j] = false
      } else if (j - i < 3) {
        dp[i][j] = true
      } else {
        dp[i][j] = dp[i + 1][j - 1]
      }
      if (dp[i][j]) {
        res += 1
      }
    }
  }
  return res
}

console.log(countSubstrings("aaa")) // 6
console.log(countSubstrings("aaaaa")) // 15
