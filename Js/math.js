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

/**
 * 力扣303. 区域和检索 - 数组不可变
 * 关键字：前缀和技巧
 * 计算索引 left 和 right （包含 left 和 right）之间的 nums 元素的 和 ，其中 left <= right
 *
 * 输入：
["NumArray", "sumRange", "sumRange", "sumRange"]
[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]
输出：
[null, 1, -1, -3]

解释：
NumArray numArray = new NumArray([-2, 0, 3, -5, 2, -1]);
numArray.sumRange(0, 2); // return 1 ((-2) + 0 + 3)
numArray.sumRange(2, 5); // return -1 (3 + (-5) + 2 + (-1)) 
numArray.sumRange(0, 5); // return -3 ((-2) + 0 + 3 + (-5) + 2 + (-1))
 */

/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  const len = nums.length
  const prenums = new Array(len + 1).fill(0)
  for (let i = 1; i < prenums.length; i++) {
    prenums[i] = prenums[i - 1] + nums[i - 1]
  }
  this.prenums = prenums
}

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function (left, right) {
  return this.prenums[right + 1] - this.prenums[left]
}
// 题解：https://mp.weixin.qq.com/s?__biz=MzAxODQxMDM0Mw==&mid=2247494095&idx=2&sn=19a2609f33eadbbda1f6b75e2298d931&scene=21#wechat_redirect
