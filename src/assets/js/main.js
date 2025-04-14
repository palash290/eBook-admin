$(document).ready(function () {
  $(".ct_menu_bar").click(function () {
    $("main").addClass("ct_show");
  });
  $(".ct_close_sidebar").click(function () {
    $("main").removeClass("ct_show");
  });
});

// $(window).on("load", function () {
//   $(".ct_loader_main").fadeOut();
// });

var options = {
  chart: {
    type: "line",
    height: 300,
  },
  series: [
    {
      name: "Data",
      data: [150, 210, 205, 200, 120, 160, 270], // Example data
    },
  ],
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  markers: {
    size: 4,
  },
  colors: ["#6366F1"], // Blue color
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

var options = {
  chart: {
    type: "bar",
    height: 300,
  },
  series: [
    {
      name: "Data",
      data: [320, 310, 295, 315, 390, 325, 315], // Example data
    },
  ],
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  colors: ["#3F51B5"], // Blue color
  plotOptions: {
    bar: {
      columnWidth: "45%",
      borderRadius: 4,
    },
  },
};

var chart = new ApexCharts(document.querySelector("#barChart"), options); // Changed ID here
chart.render();
