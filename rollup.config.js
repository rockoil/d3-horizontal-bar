import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import html from 'rollup-plugin-fill-html';

export default {
  input : 'build/app.js',
  output : {
    format : 'umd',
    name : 'app',
    file : 'dist/d3-horizontal-bar.min.js',
  },
  plugins : [
    resolve({
      jsnext : true,
      main : true,
      module : true
    }),
    html({
      template: 'src/index.html',
      filename: 'index.html'
    }),
    uglify({
      output: {
        comments: function(node, comment) {
            var text = comment.value;
            var type = comment.type;
            if (type == "comment2") {
                // multiline comment
                return /@preserve|@license|@cc_on/i.test(text);
            }
        }
      }
    })
  ],

};
