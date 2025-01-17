import Chart from 'chart.js';
import {Colors} from '../utils/colors';

function getHeight(element, height = 'auto') {
    if (height === 'auto') {
        return element.offsetHeight > 140 ? element.offsetHeight : 300;
    } else {
        return height;
    }
}

function getWidth(element, width = 'auto') {
    if (width === 'auto') {
        return element.offsetWidth > 90 ? element.offsetWidth : 300;
    } else {
        return width;
    }
}

export class DOMGraphChartjsAdapter {

    renderGraphToCanvas(canvas, graph) {
      let getChartData = function(graph) {
                let index = 0,
                    colors = new Colors(),
                    colorScheme = colors.defaultScheme();
                return {
                    labels: graph.labels,
                    datasets: graph.datasets.map(dataset => {
                        let colorIndex = index % colorScheme.length,
                            rgbColor = colors.hexToRgb(colorScheme[colorIndex]);
                        dataset.fillColor = colors.rgbToString(rgbColor, 0.2);
                        dataset.strokeColor = colors.rgbToString(rgbColor, 1);
                        dataset.pointColor = colors.rgbToString(rgbColor, 1);
                        dataset.pointStrokeColor = colors.rgbToString(rgbColor, 0.1);
                        dataset.pointHighlightFill = colors.rgbToString(rgbColor, 0.1);
                        dataset.pointHighlightStroke = colors.rgbToString(rgbColor, 1);
                        index++;

                        return dataset;
                    })
                };
            };

        let context = canvas.getContext('2d'),
            chart = new Chart(context),
            chartOptions = {
              legendTemplate : '<ul class="chartjs-legend <%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span class="pill" style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
            };

        switch (graph.graphType) {
            case 'line':
                chart = chart.Line(getChartData(graph), chartOptions);
                break;
            case 'bar':
                chart = chart.Bar(getChartData(graph), chartOptions);
                break;
            case 'radar':
                chart = chart.Radar(getChartData(graph), chartOptions);
                break;
            default:
                throw Error('Unknown graph type "' + graph.graphType + '"');
        }

        return chart;
    }

    renderSegmentGraphToCanvas(canvas, graph) {
      let getChartData = function(graph) {
                let index = 0,
                    colors = new Colors(),
                    colorScheme = colors.defaultScheme();
                return graph.labels.map(label => {
                    let colorIndex = index % colorScheme.length,
                        rgbColor = colors.hexToRgb(colorScheme[colorIndex]);
                    label.color = colors.rgbToString(rgbColor, 0.8);
                    label.highlight = colors.rgbToString(rgbColor, 1);
                    index++;

                    return label;
                });
            };

        let context = canvas.getContext('2d'),
            chart = new Chart(context),
            chartOptions = {
              legendTemplate : '<ul class="chartjs-legend <%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span class="pill" style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
            };

        switch (graph.graphType) {
            case 'pie':
                chart = chart.Pie(getChartData(graph), chartOptions);
                break;
            case 'polarArea':
                chart = chart.PolarArea(getChartData(graph), chartOptions);
                break;
            case 'doughnut':
                chart = chart.Doughnut(getChartData(graph), chartOptions);
                break;
            default:
                throw Error('Unknown segment graph type "' + graph.graphType + '"');
        }

        return chart;
    }

    renderGraphTo(element, graph) {
        element.innerHTML = '';
        let canvas = document.createElement('CANVAS');
        canvas.setAttribute('width', getWidth(element, graph.width));
        canvas.setAttribute('height', getHeight(element, graph.height));
        element.appendChild(canvas);
        let chart = this.renderGraphToCanvas(canvas, graph);
        let legend = document.createElement('DIV');
        element.appendChild(legend);
        legend.innerHTML = chart.generateLegend();
    }

    renderSegmentGraphTo(element, graph) {
        element.innerHTML = '';
        let canvas = document.createElement('CANVAS');
        canvas.setAttribute('width', getWidth(element, graph.width));
        canvas.setAttribute('height', getHeight(element, graph.height));
        element.appendChild(canvas);
        let chart = this.renderSegmentGraphToCanvas(canvas, graph);
        let legend = document.createElement('DIV');
        element.appendChild(legend);
        legend.innerHTML = chart.generateLegend();
    }
}
