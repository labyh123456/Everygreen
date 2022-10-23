// let d = require('../../public/javascripts/star_rating');
const temp = require('../../public/javascripts/temp.js')
const Calculate_Reviews =  (arr) => {
// console.log('in java mode', arr);
const starPercentage = (arr / 5) * 100;
  // Round to nearest 10
  const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
console.log('in java mode', starPercentageRounded);
// document.querySelector('.stars.inner').style.width=  '90%';
// $(".stars.inner").css({ 'width': '90%', 'font-size': '150%' });
temp(23);

}
module.exports = {
    Calculate_Reviews:Calculate_Reviews
};