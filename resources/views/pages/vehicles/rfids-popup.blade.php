<div class="popup-wrapper" v-if='popup === "rfids"'>
    <div class="popup p-2" style='max-width: 640px'>
        <div class="popup__header ">
            <div class="row">
                <div class="col-8">
                    <p class="m-0">
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_190_28395)">
                                <path
                                    d="M6.69741 4.71722C8.03829 2.65548 10.3623 1.28913 12.9998 1.28913C15.6372 1.28913 17.9612 2.65548 19.3021 4.71722L20.3833 4.01646C18.8124 1.601 16.0897 0.000244141 12.9998 0.000244141C9.90984 0.000244141 7.18711 1.60096 5.61621 4.01646L6.69741 4.71722Z"
                                    fill="#292E3A" />
                                <path
                                    d="M9.22047 6.35227C10.0246 5.11584 11.4183 4.29645 13 4.29645C14.5816 4.29645 15.9754 5.11584 16.7795 6.35227L17.8607 5.6515C16.8265 4.06136 15.0341 3.00757 13 3.00757C10.9658 3.00757 9.17343 4.06136 8.13927 5.6515L9.22047 6.35227ZM22.532 8.85971C22.1248 8.63898 21.6689 8.52363 21.2058 8.52417H17.1244V9.81306H21.2058C22.035 9.81306 22.7095 10.4876 22.7095 11.3168V19.2076C22.7095 20.0367 22.035 20.7113 21.2058 20.7113H4.79405C3.96491 20.7113 3.29035 20.0367 3.29035 19.2076V11.3167C3.29035 10.4876 3.96491 9.81302 4.79405 9.81302H8.87553V8.52413H4.79405C4.33094 8.52359 3.87504 8.63894 3.46792 8.85967C2.59538 9.33248 2.00146 10.2565 2.00146 11.3167V19.2076C2.00146 20.7474 3.25422 22.0002 4.79405 22.0002H21.2058C22.7457 22.0002 23.9984 20.7474 23.9984 19.2076V11.3167C23.9985 10.2565 23.4045 9.33252 22.532 8.85971Z"
                                    fill="#292E3A" />
                                <path
                                    d="M6.62678 16.2555H7.14667L7.8779 18.5285H9.23183L8.38383 15.8926C8.86484 15.5516 9.17778 15.0025 9.17778 14.3841C9.17778 13.3521 8.3071 12.5126 7.23689 12.5126H5.33789V18.5285H6.62678V16.2555ZM6.62678 13.8015H7.23694C7.59039 13.8015 7.88894 14.0683 7.88894 14.3841C7.88894 14.6998 7.59039 14.9666 7.23694 14.9666H6.62678V13.8015ZM10.3615 18.5274H11.6504V16.1114H12.766V14.8225H11.6504V13.8015H13.3557V12.5126H10.3615V18.5274ZM14.4257 12.5126H15.7146V18.5274H14.4257V12.5126ZM18.4962 18.517C19.9462 18.4917 20.9987 17.2313 20.9987 15.5201C20.9987 13.7213 19.9727 12.5127 18.4457 12.5127H16.8283V18.5314C16.8283 18.5313 18.1152 18.5236 18.4962 18.517ZM18.1172 13.8015H18.4457C19.6186 13.8015 19.7098 15.1169 19.7098 15.52C19.7098 16.6852 19.089 17.2175 18.4737 17.2282C18.3683 17.2301 18.2429 17.2317 18.1171 17.2331V13.8015H18.1172ZM12.9997 6.01562C11.5714 6.01562 10.4136 7.17347 10.4136 8.60178C10.4136 10.0301 11.5714 11.1879 12.9997 11.1879C14.428 11.1879 15.5859 10.0301 15.5859 8.60178C15.5859 7.17352 14.428 6.01562 12.9997 6.01562ZM12.9997 9.89904C12.2843 9.89904 11.7022 9.31698 11.7022 8.60148C11.7022 7.88601 12.2843 7.30391 12.9997 7.30391C13.7152 7.30391 14.2972 7.88597 14.2972 8.60148C14.2972 9.31698 13.7152 9.89904 12.9997 9.89904Z"
                                    fill="#292E3A" />
                            </g>
                            <defs>
                                <clipPath id="clip0_190_28395">
                                    <rect width="22" height="22" fill="white"
                                        transform="translate(2 0.000244141)" />
                                </clipPath>
                            </defs>
                        </svg>
                        Добавление RFID метки
                    </p>
                </div>
                <div class="col text-end">
                    <button class="btn p-0 btn-close" type="button" @click='popup=null'>
                    </button>
                </div>
            </div>
        </div>
        <div class="popup__body">
            <div class="row">
                <form ref='addRfid' @submit.prevent='submitRfid'>
                    <input type="hidden" :value='organisationId' name='organisation_id'>
                    <div class="row narrow-row">
                        <div class="col-12 col-md-6 mt-3">
                            <div class="form-control-custom">
                                <input type="text" id='rfid-lable' required name='label'>
                                <label for="rfid-label">Название</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 mt-3">
                            <div class="form-control-custom">
                                <input type="text" id='rfid-value' required name='value'>
                                <label for="rfid-value">Данные</label>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 text-end">
                        <button type='button' @click='checkRfid' class='btn btn-borders ms-2'>Проверить</button>
                        <button type='submit' class='btn btn-primary-alt ms-2'>Сохранить</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
</div>
