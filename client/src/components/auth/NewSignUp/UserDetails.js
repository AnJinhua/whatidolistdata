import { useState, useEffect } from 'react'
import { FormContainer } from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { fetchList } from '../../../actions/list'
import { API_URL } from '../../../constants/api'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

const UserDetails = ({ setValue, handlePage, getAllValues }) => {
  const catigoryList = useSelector((state) => state.list.List)
  const dispatch = useDispatch()

  let categoryData = axios
    .get(`${API_URL}/getExpertsCategoryList`)
    .then((res) => {
      return res.data
    })

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required('first name is required')
      .min(1, 'first name is too short')
      .max(32, 'first name is too long')
      .trim(),
    lastName: yup
      .string()
      .required('last name is required')
      .min(1, 'last name is too short')
      .max(32, 'last name is too long')
      .trim(),
    category: yup.string().required('select category'),
    subCategory: yup.string().required('select sub-category'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const [categoryExpertiseList, setCategoryExpertiseList] = useState([])

  const onChangeAreaOfExpertise = (e) => {
    const updateCategoryList = catigoryList.find(
      ({ slug }) => slug === e.target.value
    )

    setCategoryExpertiseList(updateCategoryList?.subcategories)
  }

  const onSubmit = (data) => {
    setValue('firstName', data?.firstName)
    setValue('lastName', data?.lastName)
    setValue('category', data?.category)
    setValue('subCategory', data?.subCategory)

    handlePage(3)
  }

  useEffect(() => {
    ;(async () => {
      const res = await categoryData
      if (catigoryList?.length === 0 && res) {
        dispatch(fetchList(res))
      }
    })()
  }, [catigoryList?.length, categoryData, dispatch])

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="name-container"> */}
      <div className='input-container margin'>
        <span className='input-header'>first name*</span>
        <input
          type='text'
          placeholder='first name'
          {...register('firstName')}
          className='input'
        />
        {errors?.firstName?.message && (
          <span className='instruction-error'>{`✔${errors?.firstName?.message}`}</span>
        )}
      </div>

      <div className='input-container margin'>
        <span className='input-header'>last name*</span>
        <input
          type='text'
          placeholder='last name'
          {...register('lastName')}
          className='input'
        />
        {errors?.lastName?.message && (
          <span className='instruction-error'>{`✔${errors?.lastName?.message}`}</span>
        )}
      </div>
      {/* </div> */}

      <div className='input-container margin'>
        <select
          name='categories'
          id='categories'
          {...register('category')}
          onChange={onChangeAreaOfExpertise}
          className='input'
        >
          <option value=''>area of expertise*</option>
          {catigoryList?.map(({ name, slug }) => (
            <option value={slug} key={slug}>
              {name}
            </option>
          ))}
        </select>
        {errors?.category?.message && (
          <span className='instruction-error'>{`✔${errors?.category?.message}`}</span>
        )}
      </div>

      <div className='input-container margin'>
        <select
          name='subcategories'
          {...register('subCategory')}
          className='input'
        >
          <option value=''>focus of expertise</option>
          {categoryExpertiseList?.map(({ name, slug }) => (
            <option value={slug} key={slug}>
              {name}
            </option>
          ))}
        </select>
        {errors?.subCategory?.message && (
          <span className='instruction-error'>{`✔${errors?.subCategory?.message}`}</span>
        )}
      </div>

      <button
        disabled={false}
        className={false ? 'disabled' : 'next-btn'}
        type='submit'
      >
        Next
      </button>
    </FormContainer>
  )
}

export default UserDetails
