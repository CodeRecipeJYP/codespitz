const folder = new Task('s3-4');
folder.add("2강 답안 작성");
folder.add("3강 답안 작성");

const { list } = folder.sortedList('title');
list[1].task.add('ppt정리');
list[1].task.add('코드정리');

const { list: sublist } = list[1].task.sortedList('title');
sublist[1].task.add('슬라이드마스터 정리');
sublist[1].task.add('디자인개선');

const dom = new Dom('#base');
dom.taskView(new Priority(), new Member(), new Remove());
dom.folderView(new Complete());

const renderer = new Renderer(dom);
// renderer.render(new SortedTask(folder, 'title'));
folder.toggle();
renderer.render(folder);
