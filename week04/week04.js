const folder = new Task('s3-4');
folder.add("2강 답안 작성");
folder.add("3강 답안 작성");

const todo = new DomRenderer("#a");
todo.render(folder.list('title'));
const todo2 = new ConsoleRenderer();
todo2.render(folder.list('title'));
