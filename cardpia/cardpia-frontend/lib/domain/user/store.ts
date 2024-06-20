import {  LoginResponse } from '@cardpia-app/domain/user/dto/login.dto';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { User, UserAddress, Checkin, CheckinConfig } from './types';
import { getUserById } from './api/user.api';
import { clearPrepareRemoveUsers, fetchUsers, loginUser, prepareRemoveUsers, registerUser, removeUsers, updateUser } from './action/user.action';
import { cancelRemoveAddress, clearCreateAddress, clearRemoveAddress, clearUpdateAddress, fetchUserAddressById, fetchUserAddresses, prepareRemoveAddress, prepareUpdateAddress, removeUserAddress } from './action/user-address.action';
import { checkin, confirmCreateCheckinConfig, confirmDeleteCheckinConfig, confirmUpdateCheckinConfig, createCheckinConfig, fetchCheckinConfigs, removeCheckinConfig, updateCheckinConfig } from './action/checkin.action';
import { logout, resetPassword, sendResetPasswordEmail, sendVerificationEmail, verifyEmail } from './action/auth.action';
import { types } from '@common-utils';

export const clearOperationStatus = createAsyncThunk<TYPE_OPERATIONS, TYPE_OPERATIONS>(
  'user/clear-operation-status',
  async (operation: TYPE_OPERATIONS): Promise<TYPE_OPERATIONS> => {
    return operation
  },
)

export const closeAddressDialog = createAsyncThunk<void, void>(
  'user/close-address-dialog',
  async () => {
    return
  },
)

export const fetchUserProfile = createAsyncThunk<User, string>(
  'users/profile',
  async (id: string): Promise<User> => {
    return await getUserById(id);
  }
);

export const setAuthInfo = createAsyncThunk<LoginResponse, LoginResponse>(
  'user/set-auth-info',
  async (authInfo: LoginResponse): Promise<LoginResponse> => {
    return authInfo;
  }
);

export type TYPE_OPERATIONS =
  | 'resetPassword'
  | 'sendVerificationEmail'
  | 'sendResetPasswordEmail'
  | 'verifyEmail'
  | 'login'
  | 'register'
  | 'deleteAddress'
  | 'updateAddress'
  | 'updateUser'
  | 'checkin'
  | 'createCheckinConfig'
  | 'updateCheckinConfig'
  | 'deleteCheckinConfig'


export interface UserState {
  loading: boolean;
  authInfo?: LoginResponse;
  userInfo?: User;
  userListResult: types.Paginated<User>;
  error: any;
  userToken?: string;
  success: boolean;
  operations: {
    resetPassword: types.Operation<void>
    sendVerificationEmail: types.Operation<void>
    sendResetPasswordEmail: types.Operation<void>
    verifyEmail: types.Operation<void>
    login: types.Operation<void>
    register: types.Operation<void>
    deleteAddress: types.Operation<{
      userId: string;
      addressId: string;
    }>
    removeUser: types.Operation<User>
    fetchUserAddressById: types.Operation<UserAddress>
    updateAddress: types.Operation<UserAddress>
    updateUser: types.Operation<void>
    checkin: types.Operation<Checkin>
    createCheckinConfig: types.Operation<CheckinConfig>
    updateCheckinConfig: types.Operation<CheckinConfig>
    deleteCheckinConfig: types.Operation<CheckinConfig>
  }
  myInfo: {
    userProfile?: User;
    addresses: UserAddress[];
  }
  user: {
    user: User | undefined;
  }
  checkinConfigs: CheckinConfig[]
}

const initialState: UserState = {
  loading: true,
  userInfo: undefined, // for user object
  authInfo: undefined,
  userListResult: {
    total: 0,
    count: 0,
    offset: 0,
    limit: 0,
    data: [],
  },
  myInfo: {
    userProfile: undefined,
    addresses: [],
  },
  user: {
    user: undefined,
  },
  error: undefined,
  success: false, // for monitoring the registration process.
  operations: {
    fetchUserAddressById: {
      status: 'idle',
    },
    resetPassword: {
      status: 'idle',
    },
    sendVerificationEmail: {
      status: 'idle',
    },
    sendResetPasswordEmail: {
      status: 'idle',
    },
    verifyEmail: {
      status: 'idle',
    },
    removeUser: {
      status: 'idle',
    },
    login: {
      status: 'idle',
    },
    register: {
      status: 'idle',
    },
    deleteAddress: {
      status: 'idle',
    },
    updateAddress: {
      status: 'idle',
    },
    updateUser: {
      status: 'idle',
    },
    checkin: {
      status: 'idle'
    },
    createCheckinConfig: {
      status: 'idle'
    },
    updateCheckinConfig: {
      status: 'idle'
    },
    deleteCheckinConfig: {
      status: 'idle'
    },
  },
  checkinConfigs: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // register user
    builder.addCase(registerUser.pending, (state: UserState) => {
      state.userInfo = undefined;
      state.operations.login = {
        status: 'busy',
        message: '作成中',
      }
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
      state.loading = false;
      state.operations.login = {
        status: 'succeeded',
        message: '登録に成功しました',
      }
    });
    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
      state.operations.login = {
        status: 'failed',
        message: '登録に失敗しました',
      }
    });

    builder.addCase(loginUser.pending, (state: UserState) => {
      state.loading = true
      state.operations.login.status = 'busy'
    })
    builder.addCase(loginUser.fulfilled, (state: UserState, { payload }) => {
      state.authInfo = payload as LoginResponse
      state.operations.login = {
        status: 'succeeded',
        message: 'ログインに成功しました',
      }
    }).addCase(loginUser.rejected, (state: UserState, action) => {
      state.operations.login = {
        status: 'failed',
        message: 'ログインに失敗しました',
      }
    });
    builder.addCase(prepareRemoveUsers.fulfilled, (state: UserState, { payload }) => {
      state.operations.removeUser = {
        status: 'confirm',
        message: '本当に削除しますか？',
        payload,
      }
    }).addCase(removeUsers.fulfilled, (state: UserState) => {
      state.operations.removeUser = {
        status: 'succeeded',
        message: '削除しました',
      }
    }).addCase(removeUsers.rejected, (state: UserState) => {
      state.operations.removeUser = {
        status: 'failed',
        message: '削除できませんでした',
      }
    }).addCase(clearPrepareRemoveUsers.fulfilled, (state: UserState) => {
      state.operations.removeUser = {
        status: 'idle',
      }
    });


    builder.addCase(updateUser.pending, (state: UserState) => {
      state.operations.updateUser = {
        status: 'busy',
      }
    }).addCase(updateUser.rejected, (state: UserState) => {
      state.operations.updateUser = {
        status: 'failed',
      }
    }).addCase(updateUser.fulfilled, (state: UserState) => {
      state.operations.updateUser = {
        status: 'succeeded',
      }
    });

    builder.addCase(setAuthInfo.fulfilled, (state: UserState, { payload }) => {
      state.authInfo = payload
    })

    builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
      state.userListResult = payload
    })
    builder.addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
      state.myInfo.userProfile = payload
    });

    builder.addCase(fetchUserAddresses.fulfilled, (state, { payload }) => {
      state.myInfo.addresses = payload
    });
    builder
      .addCase(clearOperationStatus.fulfilled, (state, { payload }) => {
        state.operations[payload].status = 'idle'
        state.operations[payload].message = undefined
      });
    builder.addCase(removeUserAddress.fulfilled, (state, { payload }) => {
      state.operations.deleteAddress = {
        status: 'succeeded',
        message: '住所削除しました'
      }
    })

    builder.addCase(prepareRemoveAddress.fulfilled, (state, { payload }) => {
      state.operations.deleteAddress = {
        status: 'confirm',
        message: '本当に削除しますか？',
        payload,
      }
    }).addCase(clearRemoveAddress.fulfilled, (state) => {
      state.operations.deleteAddress = {
        status: 'idle',
      }
    });
    builder.addCase(cancelRemoveAddress.fulfilled, (state, { payload }) => {
      state.operations.deleteAddress = {
        status: 'idle',
      }
    })
    builder.addCase(prepareUpdateAddress.fulfilled, (state, { payload }) => {
      state.operations.updateAddress = {
        status: 'confirm',
        payload: payload,
      }
    }).addCase(clearUpdateAddress.fulfilled, (state) => {
      state.operations.updateAddress = {
        status: 'idle',
      }
    });

    builder.addCase(fetchUserAddressById.fulfilled, (state, { payload }) => {
      state.operations.fetchUserAddressById = {
        status: 'succeeded',
        payload: payload,
      }
    }).addCase(fetchUserAddressById.rejected, (state, { payload }) => {
      state.operations.fetchUserAddressById = {
        status: 'failed',
        message: '住所を取得できませんでした'
      }
    }).addCase(fetchUserAddressById.pending, (state, { payload }) => {
      state.operations.fetchUserAddressById = {
        status: 'busy',
      }
    });
    builder.addCase(sendVerificationEmail.fulfilled, (state, { payload }) => {
      state.operations.sendVerificationEmail = {
        status: 'succeeded',
        message: '確認メールを送信しました'
      }
    }).addCase(sendVerificationEmail.rejected, (state, { payload }) => {
      state.operations.sendVerificationEmail = {
        status: 'failed',
        message: '確認メールを送信できませんでした'
      }
    })

    builder.addCase(sendResetPasswordEmail.fulfilled, (state, { payload }) => {
      state.operations.sendResetPasswordEmail = {
        status: 'succeeded',
        message: 'パスワードリセットメールを送信しました'
      }
    }).addCase(sendResetPasswordEmail.rejected, (state, { payload }) => {
      state.operations.sendResetPasswordEmail = {
        status: 'failed',
        message: 'パスワードリセットメールを送信できませんでした'
      }
    })

    builder.addCase(verifyEmail.fulfilled, (state, { payload }) => {
      state.operations.verifyEmail = {
        status: 'succeeded',
        message: 'メールアドレスを確認しました'
      }
    }).addCase(verifyEmail.rejected, (state, { payload }) => {
      state.operations.verifyEmail = {
        status: 'failed',
        message: 'メールアドレスを確認できませんでした'
      }
    })
    builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
      state.operations.resetPassword = {
        status: 'succeeded',
        message: 'パスワードをリセットしました'
      }
    }).addCase(resetPassword.rejected, (state, { payload }) => {
      state.operations.resetPassword = {
        status: 'failed',
        message: 'パスワードをリセットできませんでした'
      }
    })
    builder.addCase(logout.fulfilled, (state, { payload }) => {
      state.authInfo = undefined
      state.myInfo = {
        userProfile: undefined,
        addresses: [],
      }
    })
    builder.addCase(checkin.fulfilled, (state, { payload }) => {
      state.operations.checkin = {
        status: 'succeeded',
        payload
      }
    });
    builder.addCase(fetchCheckinConfigs.fulfilled, (state, { payload }) => {
      state.checkinConfigs = payload
    });
    builder.addCase(createCheckinConfig.fulfilled, (state, { payload }) => {
      state.operations.createCheckinConfig = {
        status: 'succeeded',
        message: 'チェックイン設定を作成しました',
        payload
      }
    }).addCase(createCheckinConfig.rejected, (state, { payload }) => {
      state.operations.createCheckinConfig = {
        status: 'failed',
        message: 'チェックイン設定を作成できませんでした'
      }
    }).addCase(confirmCreateCheckinConfig.fulfilled, (state, { payload }) => {
      state.operations.createCheckinConfig = {
        status: 'confirm',
        message: 'チェックイン設定を作成しますか？',
      }
    }).addCase(confirmUpdateCheckinConfig.fulfilled, (state, { payload }) => {
      state.operations.updateCheckinConfig = {
        status: 'confirm',
        message: 'チェックイン設定を更新しますか？',
        payload,
      }
    }).addCase(confirmDeleteCheckinConfig.fulfilled, (state, { payload }) => {
      state.operations.deleteCheckinConfig = {
        status: 'confirm',
        message: 'チェックイン設定を削除しますか？',
        payload,
      }
    }).addCase(updateCheckinConfig.fulfilled, (state, { payload }) => {
      state.operations.updateCheckinConfig = {
        status: 'succeeded',
        message: 'チェックイン設定を更新しました',
        payload,
      }
    }).addCase(removeCheckinConfig.fulfilled, (state, { payload }) => {
      state.operations.deleteCheckinConfig = {
        status: 'succeeded',
      }
    }).addCase(removeCheckinConfig.rejected, (state, { payload }) => {
      state.operations.deleteCheckinConfig = {
        status: 'failed',
        message: 'チェックイン設定を削除できませんでした'
      }
    }).addCase(updateCheckinConfig.rejected, (state, { payload }) => {
      state.operations.updateCheckinConfig = {
        status: 'failed',
        message: 'チェックイン設定を更新できませんでした'
      }
    });
  }
})

export default userSlice.reducer
