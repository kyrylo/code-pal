%w|bundler pathname logger fileutils sprockets-sass|.each do |gem|
  require gem
end

Bundler.require

ROOT = Pathname(File.dirname(__FILE__))
COMPILED_DIR = ROOT.join('compiled', 'assets')
puts COMPILED_DIR
APP_DIR = ROOT.join('app', 'assets')

task :compile do
  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = Logger.new(STDOUT)
    env.context_class.class_eval do
      def asset_path(path, options = {})
        "app/assets/#{path}"
      end
    end
  end

  %w|javascripts stylesheets|.each do |dir|
    sprockets.append_path(APP_DIR.join(dir).to_s)
  end

  %w|application.css application.js|.each do |bundle|
    assets = sprockets.find_asset(bundle)
    prefix, basename = assets.pathname.to_s.split('/')[-2..-1]
    FileUtils.mkpath(COMPILED_DIR.join(prefix))
    assets.write_to(COMPILED_DIR.join(prefix, basename.chomp('.sass')))
  end
end
