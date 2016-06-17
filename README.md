# karma-twig-preprocessor

### Usage:

In karma config define (for e.g. karma.conf.js):
```
preprocessors: {
    'src/**/*.twig': ['twig']
}
```
and can define options for preprocessor (if you need):
```
twigPreprocessor: {
    options: {
        twig: 'twig',
        module: 'amd'
    },
    filename: function(file) {
        return file.originalPath.replace(/\.twig$/, '.twig.js');
    }
}
```

