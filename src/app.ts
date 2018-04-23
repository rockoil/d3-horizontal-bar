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
  minText : param.minText,
  avgVal : param.avgVal,
  avgText : param.avgText,
  maxVal : param.maxVal,
  maxText : param.maxText,
  barHeight: param.barHeight,
  barPadding: param.barPadding,
  dataset: param.dataset
};

// svg 추가
var svg = d3.select("#chart").append("svg").attr("width", (width+margin.left+margin.right));

// making group element and call functions
// g 엘레멘트를 한든후 초기화 함수 호출
var g = svg.append("g").attr("transform", "translate("+margin.left+", "+margin.top+")")
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
    g.append("rect").attr("width", width).attr("height", _param.barHeight)
        .style("fill", "url(#gradient)");

    // set position text of grade at bar
    // 바에 텍스트 적용
    g.selectAll("text").data(_param.dataset).enter().append("text").attr("class", "bar-text")
    .attr("transform", function(d) {
      return "translate("+scale(d.data)+", "+_param.barPadding+")";
    }).text(function(d) {
      return d.text;
    });

    // Min. line and text, align
    makeRectBar(g, _param.minVal, _param.minText, "min");

    // Avg. line and text, align
    makeRectBar(g, _param.avgVal, _param.avgText, "avg");

    // Max. line and text, align
    makeRectBar(g, _param.maxVal, _param.maxText, "max");
  });
}

// vertical bar and Text box
function makeRectBar(g:any, x:any, text:any, align:any) {

    let cnt:number = 1;

    // create a vertical bar
    // 세로바 생성
    g.append("path")
    .attr("d", d3.symbol().type(d3.symbolTriangle).size(100))
    .attr("transform", "translate(0, -10)")
    .attr("fill", function() {
      if(align == "avg") {
        return "#e27037";
      } else {
        return "#000000";
      }
    })
    .transition().attr("transform", "translate("+scale(x)+", -10) rotate(180)").duration(1000);

    // create a text and set position each
    // 텍스트 박스 추가 및 텍스트 그리기
    g.append("text").attr("class", "text")
      .attr("y", -20)
      .attr("fill", function() {
        if(align == "avg") {
          return "#e27037";
        } else {
          return "#000000";
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
