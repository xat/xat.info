!function($) {

  var GITHUB_API = 'https://api.github.com/users/xat';

  var $title = $('title');
  var $main = $('#main');
  var $header = $('#header');
  var $footer = $('#footer');
  var $favicon = $('#favicon');

  var nextTheme = circulate(_.range(1, 8).map(function(num) {
    return 'theme_' + num;
  }));

  var fetch = function(route) {
    return $.get(GITHUB_API + (route || ''));
  };

  var compileDate = ago(ago_cfgs.en);

  var getTemplate = _.memoize(function(selector) {
    return _.template($(selector).html());
  });

  var sortRepos = function(repos) {
    return _.sortBy(repos, function(data) {
      return new Date(data.updated_at).getTime();
    }).reverse();
  };

  var renderRepo = function(data) {
    $main.append(getTemplate('#repo_template')({
      theme_class: nextTheme(),
      link: data.html_url,
      description: data.description,
      name: data.name,
      stars: data.stargazers_count,
      updated: compileDate(new Date(data.updated_at).getTime())
    }));
  };

  var renderRepos = function(repos) {
    _.each(sortRepos(repos), renderRepo);
  };

  var renderTitle = function(data) {
    $title.html(getTemplate('#title_template')({
      name: data.name
    }));
  };

  var renderHeader = function(data) {
    $header.html(getTemplate('#header_template')({
      link: data.html_url,
      name: data.name
    }));
  };

  var renderFooter = function(data) {
    $footer.html(getTemplate('#footer_template')({
      name: data.name,
      year: new Date().getFullYear(),
      company: data.company,
      company_link: data.blog
    }));
  };

  $favicon.attr('href', 'icon_'+ _.random(1, 8) + '.png');

  $.when(fetch(), fetch('/repos?per_page=200'))
    .then(function(info, repos) {
      renderRepos(repos[0]);
      renderTitle(info[0]);
      renderHeader(info[0]);
      renderFooter(info[0]);
    });

}(jQuery);