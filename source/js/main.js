const dropFirstList = document.querySelector('.main-drop-section__list--first');
const dropSecondList = document.querySelector('.main-drop-section__list--second');

// Функция определения середины элемента
const getNextElement = (cursorPosition, currentElement) => {
  // Получаем объект с размерами и координатами
  const currentElementCoord = currentElement.getBoundingClientRect();
  // Находим вертикальную координату центра текущего элемента
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

  // Если курсор выше центра элемента, возвращаем текущий элемент
  // В ином случае — следующий DOM-элемент
  const nextElement = (cursorPosition < currentElementCenter) ?
      currentElement :
      currentElement.nextElementSibling;

  return nextElement;
};

// Функция переноса элементов
const onDragAndDrop = (areaDrop) => {
  // Находим элементы для перетаскивания
  const dropElements = areaDrop.querySelectorAll('.main-drop-section__item');
  // Перебираем все элементы списка и присваиваем возможность перетаскивания
  dropElements.forEach((item) => {
    item.draggable = true;
  });
  // Добавляем класс перетаскиваемуму элементу
  areaDrop.addEventListener('dragstart', (evt) => {
    evt.target.classList.add('main-drop-section__item--selected');
  });
  // Удаляем класс перетаскиваемуму элементу
  areaDrop.addEventListener('dragend', (evt) => {
    evt.target.classList.remove('main-drop-section__item--selected');
  });

  // Находим зону в которой можно сбросить элемент
  areaDrop.addEventListener('dragover', (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();
    // Меняем курсор на отображение перемещения
    evt.dataTransfer.dropEffect = "move";
    // Находим перемещаемый элемент
    const activeElement = document.querySelector('.main-drop-section__item--selected');
    // Находим элемент, над которым в данный момент находится курсор
    const currentElement = evt.target;
    // Проверяем, что событие сработало:
    // 1. не на том элементе, который мы перемещаем,
    // 2. именно на элементе списка
    const isMoveable = activeElement !== currentElement &&
    currentElement.classList.contains('main-drop-section__item');
    // Если нет, прерываем выполнение функции
    if (!isMoveable) {
      return;
    }
    // Находим элемент, перед которым будем вставлять
    const nextElement = getNextElement(evt.clientY, currentElement);
    //нужно ещё учесть ситуацию, когда во время перемещения курсор был наведён на какой-то элемент и при этом центральную ось так и не пересёк
    if (
      nextElement &&
      activeElement === nextElement.previousElementSibling ||
      activeElement === nextElement
    ) {
      return;
    }
    // Вставляем activeElement перед nextElement
    areaDrop.insertBefore(activeElement, nextElement);
  });
};

// Вызываем фцнкцию переноса элементов
onDragAndDrop(dropFirstList);
onDragAndDrop(dropSecondList);
