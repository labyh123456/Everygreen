/* Javascript */ 
$(function () {
 
    $("#rateYo").rateYo({
      starWidth: "40px",
      fullstar:true,
      onSet:function(rating, rateYoInstance){
        $("#rating").val(rating);
      }

    });
    // $(".stars.inner").css({ 'width': '90%', 'font-size': '150%' });
   
  });


   let a =  $("#rateYo2").text();
   $(function () {
 
    $("#rateYo2").rateYo({
      starWidth: "40px",
      rating:a,
      readOnly:true
    })
    });
    // $(".stars.inner").css({ 'width': '90%', 'font-size': '150%' });




      // starWidth: "20px",
      // fullstar:true,
      // onSet:function(rating, rateYoInstance){
      //   $("#rating").val(rating);
      // 
    // });
    // console.log('let', a);

    // $(".stars.inner").css({ 'width': '90%', 'font-size': '150%' });
   

