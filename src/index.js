import _ from 'lodash';

if (module.hot) {
  module.hot.accept();
}

console.log(_.join([1, 2, 4, 5], ' '));