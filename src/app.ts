import * as d3 from 'd3';
//import { redditObject } from './redditFormat';

// margin
const margin = {top: 40, left: 20, right: 20, bottom: 20};

// width, height
const width = document.getElementById("chart").offsetWidth - margin.left - margin.right;
const height = document.getElementById("chart").offsetHeight + margin.top + margin.bottom;

// Scale
const scale = d3.scaleLinear().domain([0, 100]).range([0,width]);

// using bar opacity
const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// export a function
// 함수 호출
export function init(param:any) {

// parameter
const _param = {
  minVal : param.minVal,
  avgVal : param.avgVal,
  maxVal : param.maxVal
};

// svg 추가
var svg = d3.select("#chart").append("svg").attr("width", (width+margin.left+margin.right)).attr("height",  120);

// making group element and call functions
// g 엘레멘트를 한든후 초기화 함수 호출
var g = svg.append("g").attr("height", 300).attr("transform", "translate("+margin.left+", "+margin.top+")")
  .call(function(g) {

    // gradient
    var defs = g.append("defs");
    var gradient = defs.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    // using data and set offset, stop-opacity
    // 데이터를 이용하여 offset과 stop-opacity를 생성
    gradient.selectAll("stop")
      .data(data)
      .enter()
      .append("stop")
      .attr("class", "bar")
      .attr("offset", function(d) {
        return d+"%";
      })
      .attr("stop-opacity", function(d, i) {
        return (i+1)/10;
      });

    // making bar and fill color using a css
    // css를 이용하여 색상을 칠하고 bar 형태로 만듬
    g.append("rect").attr("width", width).attr("height", 40)
        .style("fill", "url(#gradient)");

    // Min. line and text
    makeRectBar(g, _param.minVal, "Min.");

    // Avg. line and text
    makeRectBar(g, _param.avgVal, "Avg.");

    // Max. line and text
    makeRectBar(g, _param.maxVal, "Max.");
  });
}
// vertical bar and Text box
function makeRectBar(g:any, x:any, text:any) {

    let cnt:number = 1;

    // create a vertical bar
    // 세로바 생성
    g.append("rect").attr("class", "rect").attr("y", -10)
      .transition().attr("transform", "translate("+scale(x)+")").duration(1000);

    // create a text and set position each
    // 텍스트 박스 추가 및 텍스트 그리기
    g.append("text").attr("class", "text")
      .attr("y", function() {
        if(text == "Avg.") {
          return 70;
        } else {
          return -20;
        }
      })
      //.text(text) // 텍스트
      .transition().attr("transform", "translate("+scale(x)+")").duration(1000)
      .on("start", function repeat() {

        // remove element for opacity equal 0
        // opacity가 0인 element는 삭제
        var t = d3.active(this).style("opacity", 0).remove();

        // display value and text by turn
        // 값과 텍스트가 교대로 나오도록 한다.
        d3.select(this).style("opacity", 0).text(function() {
          return cnt === 1 ? text : x
        })
        .transition(t).style("opacity", 1)
        .transition().delay(4500).on("start", repeat);

        cnt = (cnt%2) + 1;
    });
}
