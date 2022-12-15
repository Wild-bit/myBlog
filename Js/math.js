/**
 * 关键字：二分搜索
 * 给定有 n 个元素的升序整型数组 nums和一个目标值 target，
 * 写一个函数搜索 nums 中的target，如果目标值存在返回下标，否则返回-1。
 *
 * 示例1：
 * 输入：nums = [-1,0,3,5,9,12], target = 9
 * 输出：4
 * 解释：9 出现在 nums 中并且下标为 4
 *
 * 示例2：
 * 输入：nums = [-1,0,3,5,9,12], target = 2
 * 输出：-1
 * 解释：2 不存在 nums 中因此返回 -1
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const search = function (nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left
    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] < target) {
      left = mid + 1
    } else if (nums[mid] > target) {
      right = mid - 1
    }
  }
  return -1
}
// 基本思路就是给定一个值mid 它的搜索范围 [left,right],由于数组是升序的，所以当nums[mid] < target的时候
// 目标值则在mid的右边，则搜索区间需要变为[mid + 1,right],否则变为[left, mid-1]

// 参考链接：https://leetcode.cn/problems/binary-search/solution/er-fen-cha-zhao-by-leetcode-solution-f0xw/
