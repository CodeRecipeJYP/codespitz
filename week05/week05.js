const dom = new Dom('#base');
r.taskView(new Remove((_) => renderer.render(folder.list('title'))));
// r.taskView(new Member('hika', 'summer'), new Priority());

const renderer = new Renderer(dom);
renderer.render(folder.list('title'));
