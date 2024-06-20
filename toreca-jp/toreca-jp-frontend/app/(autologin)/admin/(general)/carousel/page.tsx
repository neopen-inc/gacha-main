"use client"

import { fetchCategories } from "@toreca-jp-app/domain/oripa/action/category.action";
import { PatchCategoryDto, PostCategoryDto } from "@toreca-jp-app/domain/oripa/dto/category";

import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";

import _ from "lodash";
import React, { useEffect } from "react";

type CategoryForm = Omit<PostCategoryDto, 'status'> & { status: boolean };
type UpdateCategoryForm = Omit<PatchCategoryDto, 'status'> & { status?: boolean };
export default function AdminCategoryPage() {
  const dispatch = useAppDispatch();
  const [openDeleteCategory, setOpenDeleteCategory] = React.useState(false);
  //const category = useAppSelector(state => state.oripa.category.categories);
  const categories = useAppSelector(state => state.oripa.operations.fetchCategories.payload);
  const updateCategoryOperation = useAppSelector(state => state.oripa.operations.updateCategory);
  const createCategoryOperation = useAppSelector(state => state.oripa.operations.createCategory);
  const removeCategoryOperation = useAppSelector(state => state.oripa.operations.removeCategory);
  useEffect(() => {
    dispatch(fetchCategories({}));
  }, []);
  /*
  const defaultCategoryFormValues: CategoryForm = useMemo(() => {
    console.log(updateCategoryOperation.payload);
    return updateCategoryOperation.payload ? {
      ..._.omit(updateCategoryOperation.payload, 'id'),
      status: updateCategoryOperation.payload.status === 'active'
    } : {
    name: '',
    description: '',
    status: false,
  }}, [updateCategoryOperation])
  
  const categoryForm = useForm({
    defaultValues: defaultCategoryFormValues
  });
  useEffect(() => {
    categoryForm.reset(defaultCategoryFormValues);
  }, [categoryForm, defaultCategoryFormValues]);
  const onSubmit = (data: CategoryForm) => {
    if (updateCategoryOperation.status === 'confirm' && updateCategoryOperation.payload) {
      dispatch(updateCategoryById({ id: updateCategoryOperation.payload.id, 
        category: { name: data.name, description: data.description, status: data.status ? 'active' : 'inactive' } })).finally(() => {
          dispatch(fetchCategories({}));
          setTimeout(() => {
          }, 5000);
        })
    }
    /*
    if (createCategoryOperation.status === 'confirm') {
      dispatch(createCategory({
        name: data.name,
        description: data.description,
        status: data.status ? 'active' : 'inactive',
      })).finally(() => {
        dispatch(fetchCategories({}));
        setTimeout(() => {
          //dispatch(clearOperationStatus('createCategory'));
        }, 5000);
      })
    }
  }

  const closeEditOrCreateDialog = async () => {
    if (updateCategoryOperation.status === 'confirm') {
      //dispatch(clearOperationStatus('updateCategory'));
    }
    if (createCategoryOperation.status === 'confirm') {
      //dispatch(clearOperationStatus('createCategory'));
    }
  }
  const editOrCreateDialogTitle = (): string => {
    if (updateCategoryOperation.status === 'confirm') {
      return 'カテゴリー編集';
    }
    if (createCategoryOperation.status === 'confirm') {
      return 'カテゴリー作成';
    }
    return '';
  }
  const editOrCreateDialogConfirmButtonLabel = (): string => {
    if (updateCategoryOperation.status === 'confirm') {
      return '更新';
    }
    if (createCategoryOperation.status === 'confirm') {
      return '作成';
    }
    return '';
  }
  
  const isCategoryOperationSucceeded = _.partial(isOperationSucceeded, [updateCategoryOperation, createCategoryOperation]);
  const isCategoryOperationFailed = _.partial(isOperationFailed, [updateCategoryOperation, createCategoryOperation]);
*/
  return <></>
}

/***
 * 
 * 
 * <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">カテゴリー</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: 'カテゴリー', link: '/admin/category' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
          <div>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <IconSearch />
              </span>
              <input
                id="search"
                name="search"
                type="search"
                className="
            w-full
            py-2
            text-sm text-gray-900
            rounded-md
            pl-10
            border border-gray-300
            focus:outline-none focus:ring-gray-500 focus:ring-gray-500 focus:z-10
          "
                placeholder="Search Series"
              />
            </div>
          </div>
          <div>
            <div>
              <NewButton label="新規作成" onClick={() => {
                dispatch(prepareCreateCategory())
                //dispatch(setCategoryEditMode('create')).then(() => setCategory(undefined)).then(() => setOpenCreateCategory(true));
              }} />
            </div>
          </div>
        </div>
        {categories && <AdminTable columns={[
          {
            title: 'カテゴリー',
            textAlign: 'left',
            dataField: 'name'
          },
          {
            title: 'ステータス',
            textAlign: 'left',
            dataField: 'status'
          }
        ]} objectList={categories} 
        onPage={function (page: number, limit: number): void {
          dispatch(fetchCategories({ skip: (page - 1) * limit, top: limit, orderby: 'createdAt DESC' }))
        } } actions={[
          {
            operation: (category) => dispatch(prepareUpdateCategory(category)),
            content: <IconPencil />
          },
          {
            operation: (category) => {},
            content: <IconDelete />
          },
        ]} />}
      </div >
    </div >

    <FormDialog open={updateCategoryOperation.status === 'confirm' || createCategoryOperation.status === 'confirm'} 
      okText={editOrCreateDialogConfirmButtonLabel()}
      title={editOrCreateDialogTitle()} 
      close={closeEditOrCreateDialog}
      submit={categoryForm.handleSubmit(onSubmit)
      }>
      <div className="space-y-4">
        <Controller
          name="name"
          control={categoryForm.control}
          render={({ field }) => <Input {...field} placeholder="カテゴリー名" />}
        />
        <Controller
          name="description"
          control={categoryForm.control}
          render={({ field }) => <Input {...field} placeholder="説明" />}
        />
        <Controller
          name="status"
          control={categoryForm.control}
          render={({ field }) => <Switch checked={field.value} onChange={field.onChange} label="ステータス"  />}
        />

      </div>

    </FormDialog>

    <Alert className="fixed bottom-10 left-10 max-w-screen-md" open={isCategoryOperationFailed() || isCategoryOperationSucceeded()} color={
      isCategoryOperationSucceeded() ? 'green' : 'red'
    }>
      {updateCategoryOperation.message || createCategoryOperation.message || ''}
    </Alert>

    <Dialog open={openDeleteCategory} handler={() => setOpenDeleteCategory(false)}>
      <DialogHeader>カテゴリー削除</DialogHeader>
      <DialogBody divider>
        {removeCategoryOperation.payload && removeCategoryOperation.payload.name}を削除しますか？
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => setOpenDeleteCategory(false)}
          className="mr-1"
        >
          <span>キャンセル</span>
        </Button>
        <Button variant="gradient" color="green" onClick={() => {
          const category = removeCategoryOperation.payload;
          if (!category) {
            alert("カテゴリーが選択されていません。");
            return;
          }
          dispatch(removeCategoryById(category.id)).then(() => {
            dispatch(fetchCategories({}));
          })
          setOpenDeleteCategory(false);
        }}>
          <span>削除</span>
        </Button>
      </DialogFooter>

    </Dialog>

  </>
 
        (event) => {
        event.preventDefault();
        if (categoryEditMode === 'create') {
          dispatch(createCategory({
            name: (event.target as any).name.value,
            description: (event.target as any).description.value,
            status: 'active',
          })
          ).then(() => {
            setOpenCreateCategory(false);
            dispatch(getCategories({}))
          });
        } else if (categoryEditMode === 'edit') {
          if (!category?.id) {
            return;
          }
          dispatch(patchCategory({ id: category?.id, category: { name: (event.target as any).name.value, description: (event.target as any).description.value } })).then(() => {
            setOpenCreateCategory(false);
            dispatch(getCategories({}));
          })
        }
      }
 * 
 */